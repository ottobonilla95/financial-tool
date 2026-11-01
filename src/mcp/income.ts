import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

const TTL_MS = 15 * 60 * 1000;
const validDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
};
const inputSchema = z.object({
  amount: z.number().finite().positive().max(99999999.99).refine(
    value => Math.abs(value * 100 - Math.round(value * 100)) < 0.000001,
    "Income must have at most two decimal places.",
  ),
  date: z.string().refine(validDate, "Use a real calendar date in YYYY-MM-DD format."),
  description: z.string().trim().min(1).max(255),
  categoryId: z.string().uuid(),
  subCategoryId: z.string().uuid().nullable().optional(),
  currencyId: z.number().int().positive().optional(),
});
type Income = z.infer<typeof inputSchema> & { id: string; currencyId: number };
type Review = { version: 2; kind: "income"; userId: string; expiresAt: number; income: Income };
type Auth = { authInfo?: { scopes?: string[]; extra?: Record<string, unknown> } };
type Db = Pick<PrismaClient, "earning_category" | "currency">;

function userId(extra: Auth, scope: string) {
  const id = extra?.authInfo?.extra?.userId;
  if (typeof id !== "string" || !id) throw new Error("Authenticated user identity is missing.");
  if (!extra.authInfo?.scopes?.includes(scope)) throw new Error(`Missing required OAuth scope: ${scope}.`);
  return id;
}
function secret() {
  const value = process.env.MCP_REVIEW_SECRET || process.env.AUTH_SECRET;
  if (!value) throw new Error("MCP_REVIEW_SECRET or AUTH_SECRET is required for review tokens.");
  return value;
}
function sign(review: Review) {
  const data = Buffer.from(JSON.stringify(review)).toString("base64url");
  return `${data}.${createHmac("sha256", secret()).update(data).digest("base64url")}`;
}
function read(token: string, owner: string): Review {
  const [data, signature, extra] = token.split(".");
  if (!data || !signature || extra) throw new Error("Invalid income review token.");
  const expected = createHmac("sha256", secret()).update(data).digest();
  const received = Buffer.from(signature, "base64url");
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) throw new Error("Invalid income review signature.");
  const review = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as Review;
  if (review.version !== 2 || review.kind !== "income" || review.userId !== owner) throw new Error("Income review is not valid for this user.");
  if (!Number.isFinite(review.expiresAt) || review.expiresAt <= Date.now()) throw new Error("Income review expired. Preview again.");
  return review;
}
async function references(db: Db, owner: string, input: z.infer<typeof inputSchema>) {
  const category = await db.earning_category.findFirst({
    where: { id: input.categoryId, user_id: owner },
    select: { name: true, earning_subcategory: { select: { id: true, name: true } } },
  });
  if (!category) throw new Error("Choose an income category belonging to the authenticated user.");
  const subcategory = category.earning_subcategory.find(x => x.id === input.subCategoryId);
  if (input.subCategoryId && !subcategory) throw new Error("Income subcategory does not belong to this category.");
  const currency = await db.currency.findUnique({ where: { id: input.currencyId }, select: { currencyCode: true } });
  if (!currency) throw new Error("Choose a valid currency.");
  return { categoryName: category.name, subcategoryName: subcategory?.name || null, currencyCode: currency.currencyCode };
}
function result(data: Record<string, unknown>, text: string) {
  return { structuredContent: data, content: [{ type: "text" as const, text }] };
}

export function registerIncomeTools(server: Pick<McpServer, "registerTool">, prisma: PrismaClient) {
  server.registerTool("preview_income", {
    title: "Preview income entry",
    description: "Prepare one completed income entry for review without saving it. First get real income category IDs from get_transaction_import_context, check duplicates, and resolve missing dates or currency. Show this exact preview before commit_income. Internal transfers are not income.",
    inputSchema: inputSchema.shape,
    annotations: { readOnlyHint: true, openWorldHint: false },
  }, async (args, extra) => {
    const owner = userId(extra, "transactions:read");
    const input = inputSchema.parse(args);
    const user = await prisma.users.findUniqueOrThrow({ where: { id: owner }, select: { currency_id: true } });
    const currencyId = input.currencyId || user.currency_id;
    if (!currencyId) throw new Error("Choose an income currency.");
    const income: Income = { ...input, currencyId, id: randomUUID() };
    const labels = await references(prisma, owner, income);
    const duplicateCount = await prisma.earning.count({ where: {
      user_id: owner, date: new Date(`${income.date}T12:00:00Z`), amount: income.amount, currencyId,
    } });
    const warnings = duplicateCount ? [`${duplicateCount} income entry(s) with this date, amount, and currency already exist. Check for duplicates before confirming.`] : [];
    const review: Review = { version: 2, kind: "income", userId: owner, expiresAt: Date.now() + TTL_MS, income };
    return result({ status: "ready_for_confirmation", income: { ...income, ...labels }, warnings,
      reviewToken: sign(review), expiresAt: new Date(review.expiresAt).toISOString() },
    `Income preview: ${income.date} — ${income.description} — ${income.amount.toFixed(2)} ${labels.currencyCode} — ${labels.categoryName}. ${warnings.join(" ")} Confirm this exact preview before commit_income.`);
  });

  server.registerTool("commit_income", {
    title: "Save confirmed income",
    description: "Save exactly the income in a signed preview_income token, only after explicit user confirmation. Preview again after changes or expiry. Repeating the same token returns the existing entry and never creates a duplicate.",
    inputSchema: { reviewToken: z.string().min(20) },
    annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async ({ reviewToken }, extra) => {
    const owner = userId(extra, "transactions:write");
    const review = read(reviewToken, owner);
    const income = review.income;
    inputSchema.parse(income);
    const receipt = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await references(tx, owner, income);
      // A stable ID in the signed preview makes retries safe, including concurrent calls.
      const inserted = await tx.earning.createMany({ skipDuplicates: true, data: [{
        id: income.id, user_id: owner, amount: income.amount, date: new Date(`${income.date}T12:00:00Z`),
        description: income.description, category_id: income.categoryId,
        subcategory_id: income.subCategoryId || null, currencyId: income.currencyId,
      }] });
      if (inserted.count) await tx.users.update({ where: { id: owner }, data: { last_updated: new Date() } });
      const saved = await tx.earning.findFirstOrThrow({ where: { id: income.id, user_id: owner } });
      return { status: inserted.count ? "committed" : "already_committed", createdCount: inserted.count,
        income: { id: saved.id, date: saved.date.toISOString().slice(0, 10), amount: Number(saved.amount),
          description: saved.description, categoryId: saved.category_id, subCategoryId: saved.subcategory_id, currencyId: saved.currencyId } };
    });
    return result(receipt, `${receipt.createdCount ? "Saved" : "Already saved"} income: ${receipt.income.date} — ${receipt.income.amount.toFixed(2)}. Entry ID: ${receipt.income.id}.`);
  });
}
