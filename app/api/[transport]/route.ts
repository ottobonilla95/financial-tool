import { createHmac, timingSafeEqual } from "node:crypto";
import { createMcpHandler, withMcpAuth } from "mcp-handler";
import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";
import { ensureOAuthTokenTable, hashToken, MCP_RESOURCE } from "@/src/mcp/oauth";

const prisma = new PrismaClient();
const MCP_TIMEZONE = process.env.MCP_TIMEZONE || "Europe/Warsaw";
const REVIEW_TOKEN_TTL_MS = 15 * 60 * 1000;
const REVIEW_UI_URI = "ui://track-my-spend/transaction-import-review.html";

const CLASSIFICATIONS = [
  "expense", "income", "refund", "declined", "reversed", "transfer",
  "duplicate", "non_transaction", "uncertain",
] as const;
type Classification = (typeof CLASSIFICATIONS)[number];

type NormalizedExpense = {
  sourceIndex: number;
  rawText: string;
  amount: number;
  date: string;
  description: string;
  categoryId: string;
  subCategoryId: string | null;
  currencyId: number | null;
  originalAmount: number | null;
  exchangeRate: number | null;
};
type ReviewTokenPayload = {
  version: 1;
  userId: string;
  expiresAt: number;
  sourceCount: number;
  excludedCounts: Partial<Record<Classification, number>>;
  expenses: NormalizedExpense[];
};

const expenseInputSchema = z.object({
  amount: z.number().finite().positive(),
  date: z.string().describe("Calendar date in YYYY-MM-DD format."),
  description: z.string().min(1).max(255),
  categoryId: z.string().uuid(),
  subCategoryId: z.string().uuid().nullable().optional(),
  currencyId: z.number().int().positive().nullable().optional(),
  originalAmount: z.number().finite().positive().nullable().optional(),
  exchangeRate: z.number().finite().positive().nullable().optional(),
});
const classifiedItemSchema = z.object({
  sourceIndex: z.number().int().positive(),
  rawText: z.string().min(1).max(2000),
  classification: z.enum(CLASSIFICATIONS),
  reason: z.string().min(1).max(500),
  expense: expenseInputSchema.optional(),
});

type HandlerExtra = { authInfo?: { scopes?: string[]; extra?: Record<string, unknown> } };
function requireUserId(extra?: HandlerExtra) {
  const userId = extra?.authInfo?.extra?.userId;
  if (typeof userId !== "string") throw new Error("Authenticated user identity is missing.");
  return userId;
}
function requireScope(extra: HandlerExtra | undefined, scope: string) {
  if (!extra?.authInfo?.scopes?.includes(scope)) throw new Error(`Missing required OAuth scope: ${scope}.`);
}

function getReviewSecret() {
  const secret = process.env.MCP_REVIEW_SECRET || process.env.AUTH_SECRET;
  if (!secret) throw new Error("MCP_REVIEW_SECRET or AUTH_SECRET is required for review tokens.");
  return secret;
}

function isValidYmd(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [, y, m, d] = match;
  const date = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d), 12));
  return date.getUTCFullYear() === Number(y) && date.getUTCMonth() === Number(m) - 1 && date.getUTCDate() === Number(d);
}
function parseDateForDb(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12));
}
function toYmd(date: Date) { return date.toISOString().slice(0, 10); }

function encodeReviewToken(payload: ReviewTokenPayload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", getReviewSecret()).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}
function decodeReviewToken(token: string, authenticatedUserId: string): ReviewTokenPayload {
  const [encoded, signature, extra] = token.split(".");
  if (!encoded || !signature || extra) throw new Error("Invalid review token.");
  const expected = createHmac("sha256", getReviewSecret()).update(encoded).digest();
  const received = Buffer.from(signature, "base64url");
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) throw new Error("Invalid review token signature.");
  const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as ReviewTokenPayload;
  if (payload.version !== 1 || payload.userId !== authenticatedUserId) throw new Error("Review token is not valid for this user.");
  if (!Number.isFinite(payload.expiresAt) || payload.expiresAt < Date.now()) throw new Error("Review token expired. Preview the import again.");
  return payload;
}

function jsonResult(data: Record<string, unknown>, text: string) {
  return { structuredContent: data, content: [{ type: "text" as const, text }] };
}

async function getImportContext(userId: string) {
  const [user, expenseCategories, incomeCategories, currencies] = await Promise.all([
    prisma.users.findUnique({
      where: { id: userId },
      select: { lang: true, currency: { select: { id: true, name: true, symbol: true, currencyCode: true } } },
    }),
    prisma.expense_category.findMany({
      where: { user_id: userId },
      select: { id: true, name: true, color: true, expense_subcategory: { select: { id: true, name: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.earning_category.findMany({
      where: { user_id: userId },
      select: { id: true, name: true, color: true, earning_subcategory: { select: { id: true, name: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.currency.findMany({
      select: { id: true, name: true, symbol: true, currencyCode: true, countryCode: true },
      orderBy: { name: "asc" },
    }),
  ]);
  return {
    currentDate: new Intl.DateTimeFormat("en-CA", { timeZone: MCP_TIMEZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()),
    timezone: MCP_TIMEZONE,
    language: user?.lang === "es" ? "es" : "en",
    defaultCurrency: user?.currency || null,
    currencies,
    expenseCategories: expenseCategories.map((category) => ({ id: category.id, name: category.name, color: category.color, subcategories: category.expense_subcategory })),
    incomeCategories: incomeCategories.map((category) => ({ id: category.id, name: category.name, color: category.color, subcategories: category.earning_subcategory })),
    classifications: CLASSIFICATIONS,
    policy: {
      workflow: [
        "Call get_transaction_import_context before classifying a new paste.",
        "Account for every source transaction exactly once and preserve its raw text.",
        "Only classification=expense may contain an expense payload.",
        "Call preview_transaction_import and show expenses, exclusions, uncertainties, warnings, and totals.",
        "Call commit_transaction_import only after the user explicitly confirms the preview.",
      ],
      rules: [
        "Declined, failed, cancelled, pending, and reversed transactions are not expenses.",
        "Income, refunds, and transfers between owned accounts are not expenses.",
        "A date heading applies to following items until another date heading appears.",
        "Do not invent a date. Use uncertain when no reliable date is available.",
        "Normalize a negative debit to a positive amount only after confirming it is a completed expense.",
        "When two currencies appear, amount is the booked amount and originalAmount is the merchant amount when clear.",
        "Never turn a second same-currency amount into another expense unless it is clearly a separate charge.",
        "Use only IDs returned by this tool; never silently fall back to the first category.",
      ],
    },
  };
}

type Review = {
  sourceCount: number;
  expenses: Array<NormalizedExpense & { categoryName: string; subcategoryName: string | null; currencyCode: string | null }>;
  excluded: Array<{ sourceIndex: number; rawText: string; classification: Classification; reason: string }>;
  warnings: Array<{ sourceIndex?: number; message: string }>;
  totalsByCurrency: Record<string, number>;
};
function renderReviewText(review: Review) {
  const expenses = review.expenses.map((x) => `- #${x.sourceIndex}: ${x.date} — ${x.description} — ${x.amount.toFixed(2)} ${x.currencyCode || "default currency"} — ${x.categoryName}${x.subcategoryName ? ` / ${x.subcategoryName}` : ""}`);
  const excluded = review.excluded.map((x) => `- #${x.sourceIndex}: ${x.classification} — ${x.reason} — ${x.rawText}`);
  const warnings = review.warnings.map((x) => `- ${x.sourceIndex ? `#${x.sourceIndex}: ` : ""}${x.message}`);
  return [
    `Import preview: ${review.expenses.length} expense(s) from ${review.sourceCount} source item(s).`,
    `Totals: ${Object.entries(review.totalsByCurrency).map(([code, total]) => `${total.toFixed(2)} ${code}`).join(", ") || "0"}`,
    "", "Expenses to save:", expenses.join("\n") || "- None", "", "Not saved:", excluded.join("\n") || "- None",
    ...(warnings.length ? ["", "Warnings:", warnings.join("\n")] : []),
    "", "Ask the user to confirm this exact preview before calling commit_transaction_import.",
  ].join("\n");
}

const REVIEW_UI_HTML = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Transaction import review</title><style>
:root{color-scheme:light dark;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif}body{margin:0;padding:16px;background:transparent;color:CanvasText}.card{border:1px solid color-mix(in srgb,CanvasText 18%,transparent);border-radius:16px;overflow:hidden;background:color-mix(in srgb,Canvas 96%,CanvasText 4%)}header{padding:18px;display:flex;align-items:start;justify-content:space-between;gap:12px;border-bottom:1px solid color-mix(in srgb,CanvasText 12%,transparent)}h1{font-size:18px;margin:0 0 5px}.muted{opacity:.65;font-size:13px}.total{text-align:right;font-weight:700}.summary{display:flex;gap:8px;flex-wrap:wrap;padding:12px 18px}.pill{font-size:12px;padding:5px 9px;border-radius:999px;background:color-mix(in srgb,CanvasText 8%,transparent)}.scroll{overflow-x:auto}table{width:100%;border-collapse:collapse;min-width:620px}th,td{padding:11px 14px;border-top:1px solid color-mix(in srgb,CanvasText 10%,transparent);text-align:left;font-size:13px}th{opacity:.6;font-size:11px;text-transform:uppercase;letter-spacing:.04em}td.amount{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}.excluded{padding:14px 18px 18px;border-top:1px solid color-mix(in srgb,CanvasText 12%,transparent)}.excluded h2{font-size:14px;margin:0 0 8px}.excluded-item,.warning{font-size:12px;margin-top:7px;padding:8px 10px;border-radius:9px;background:color-mix(in srgb,CanvasText 6%,transparent)}.warning{background:color-mix(in srgb,#d99a00 18%,transparent)}.empty{padding:28px;text-align:center;opacity:.6}
</style></head><body><main class="card" id="app"><div class="empty">Preparing transaction review…</div></main><script>
const root=document.getElementById('app');const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(result){const d=result?.structuredContent||result;if(!d||d.status!=='ready_for_confirmation')return;const totals=Object.entries(d.totalsByCurrency||{}).map(([c,v])=>esc(Number(v).toFixed(2)+' '+c)).join('<br>')||'0';const rows=(d.expenses||[]).map(x=>'<tr><td>#'+esc(x.sourceIndex)+'</td><td>'+esc(x.date)+'</td><td>'+esc(x.description)+'</td><td>'+esc(x.categoryName)+(x.subcategoryName?' / '+esc(x.subcategoryName):'')+'</td><td class="amount">'+esc(Number(x.amount).toFixed(2))+' '+esc(x.currencyCode||'')+'</td></tr>').join('');const excluded=(d.excluded||[]).map(x=>'<div class="excluded-item"><strong>#'+esc(x.sourceIndex)+' · '+esc(x.classification)+'</strong> — '+esc(x.reason)+'<div class="muted">'+esc(x.rawText)+'</div></div>').join('');const warnings=(d.warnings||[]).map(x=>'<div class="warning">'+(x.sourceIndex?'#'+esc(x.sourceIndex)+': ':'')+esc(x.message)+'</div>').join('');root.innerHTML='<header><div><h1>Expense import review</h1><div class="muted">Review before confirming in the conversation</div></div><div class="total">'+totals+'</div></header><div class="summary"><span class="pill">'+esc(d.expenses.length)+' expenses</span><span class="pill">'+esc(d.excluded.length)+' excluded</span><span class="pill">'+esc(d.sourceCount)+' source items</span></div><div class="scroll"><table><thead><tr><th>Source</th><th>Date</th><th>Description</th><th>Category</th><th style="text-align:right">Amount</th></tr></thead><tbody>'+rows+'</tbody></table></div><section class="excluded"><h2>Not being saved</h2>'+(excluded||'<div class="muted">None</div>')+warnings+'</section>'}
const initId='track-my-spend-'+Date.now();window.addEventListener('message',e=>{const m=e.data;if(m?.id===initId&&m?.result){window.parent.postMessage({jsonrpc:'2.0',method:'ui/notifications/initialized'},'*')}if(m?.method==='ui/notifications/tool-result')render(m.params);if(m?.result?.structuredContent)render(m.result)});window.parent.postMessage({jsonrpc:'2.0',id:initId,method:'ui/initialize',params:{protocolVersion:'2026-01-26',appInfo:{name:'track-my-spend-review',title:'Track My Spend Review',version:'1.0.0'},appCapabilities:{}}},'*');if(window.openai?.toolOutput)render(window.openai.toolOutput);let checks=0;const timer=setInterval(()=>{if(window.openai?.toolOutput)render(window.openai.toolOutput);if(++checks>30)clearInterval(timer)},250);
</script></body></html>`;

const handler = createMcpHandler((server) => {
  server.registerResource("transaction-import-policy", "trackmyspend://transaction-import-policy", {
    title: "Track My Spend transaction import policy", description: "Portable rules for classifying and importing transactions.", mimeType: "application/json",
  }, async (_uri, extra) => {
    const context = await getImportContext(requireUserId(extra));
    return { contents: [{ uri: "trackmyspend://transaction-import-policy", mimeType: "application/json", text: JSON.stringify({ classifications: context.classifications, policy: context.policy }) }] };
  });

  server.registerResource("transaction-import-review-ui", REVIEW_UI_URI, {
    title: "Track My Spend import review", description: "Interactive review of classified expense imports.", mimeType: "text/html;profile=mcp-app",
  }, async () => ({ contents: [{ uri: REVIEW_UI_URI, mimeType: "text/html;profile=mcp-app", text: REVIEW_UI_HTML, _meta: { ui: { csp: { connectDomains: [], resourceDomains: [] } } } }] }));

  server.registerPrompt("import_transactions", {
    title: "Import transactions", description: "Classify pasted transactions and safely import confirmed expenses.",
    argsSchema: { transactions: z.string().describe("Raw transaction text to classify.") },
  }, ({ transactions }) => ({ messages: [{ role: "user" as const, content: { type: "text" as const, text: `Import these transactions into Track My Spend. First call get_transaction_import_context. Account for every source item, classify it, call preview_transaction_import, show the complete preview, and wait for explicit confirmation before committing.\n\n${transactions}` } }] }));

  server.registerTool("get_transaction_import_context", {
    title: "Get transaction import context",
    description: "Start every new transaction import with this read-only tool. Returns real categories, currencies, timezone, current date, classifications, and mandatory rules. The connected model performs classification; this server does not call an LLM.",
    inputSchema: {}, annotations: { readOnlyHint: true, openWorldHint: false },
  }, async (_args, extra) => {
    const context = await getImportContext(requireUserId(extra));
    return jsonResult(context as unknown as Record<string, unknown>, `Context loaded: ${context.expenseCategories.length} expense categories, ${context.incomeCategories.length} income categories, and ${context.currencies.length} currencies. Classify every item, then call preview_transaction_import.`);
  });

  server.registerTool("get_recent_transactions", {
    title: "Get recent transactions", description: "Read recent expenses and income to check for duplicates before previewing an import.",
    inputSchema: { dateFrom: z.string().describe("Start date in YYYY-MM-DD."), dateTo: z.string().describe("End date in YYYY-MM-DD."), limit: z.number().int().min(1).max(200).optional().default(100) },
    annotations: { readOnlyHint: true, openWorldHint: false },
  }, async ({ dateFrom, dateTo, limit }, extra) => {
    if (!isValidYmd(dateFrom) || !isValidYmd(dateTo) || dateFrom > dateTo) throw new Error("Provide a valid inclusive YYYY-MM-DD date range.");
    const range = { gte: parseDateForDb(dateFrom), lte: parseDateForDb(dateTo) };
    const userId = requireUserId(extra);
    const [expenses, income] = await Promise.all([
      prisma.expenses.findMany({ where: { user_id: userId, date: range }, select: { id: true, date: true, description: true, amount: true, category_id: true, subcategory_id: true, currencyId: true }, orderBy: { date: "desc" }, take: limit }),
      prisma.earning.findMany({ where: { user_id: userId, date: range }, select: { id: true, date: true, description: true, amount: true, category_id: true, subcategory_id: true, currencyId: true }, orderBy: { date: "desc" }, take: limit }),
    ]);
    const data = {
      expenses: expenses.map((x) => ({ ...x, date: toYmd(x.date), amount: Number(x.amount) })),
      income: income.map((x) => ({ ...x, date: toYmd(x.date), amount: Number(x.amount) })),
    };
    return jsonResult(data, `Found ${data.expenses.length} expense(s) and ${data.income.length} income record(s) from ${dateFrom} through ${dateTo}.`);
  });

  server.registerTool("preview_transaction_import", {
    title: "Preview transaction import",
    description: "Validate a complete model-classified batch. Include every source item exactly once. Only completed expenses are prepared for insertion; all other classifications are shown but excluded. Never commit without showing this preview and receiving explicit user confirmation.",
    inputSchema: { sourceCount: z.number().int().min(1).max(200), items: z.array(classifiedItemSchema).min(1).max(200) },
    annotations: { readOnlyHint: true, openWorldHint: false },
    _meta: { ui: { resourceUri: REVIEW_UI_URI }, "openai/outputTemplate": REVIEW_UI_URI },
  }, async ({ sourceCount, items }, extra) => {
    const userId = requireUserId(extra);
    const uniqueIndexes = new Set(items.map((x) => x.sourceIndex));
    if (items.length !== sourceCount || uniqueIndexes.size !== sourceCount) throw new Error("Every source transaction must appear exactly once; sourceCount, item count, and unique source indexes must match.");
    for (const item of items) {
      if (item.classification === "expense" && !item.expense) throw new Error(`#${item.sourceIndex} is an expense but has no expense payload.`);
      if (item.classification !== "expense" && item.expense) throw new Error(`#${item.sourceIndex} is not an expense and must not have an expense payload.`);
    }
    const context = await getImportContext(userId);
    const categories = new Map(context.expenseCategories.map((x) => [x.id, x]));
    const subcategoryParents = new Map<string, string>();
    for (const category of context.expenseCategories) for (const subcategory of category.subcategories) subcategoryParents.set(subcategory.id, category.id);
    const currencyMap = new Map(context.currencies.map((x) => [x.id, x]));
    const expenses: Review["expenses"] = [];
    for (const item of items) {
      if (item.classification !== "expense" || !item.expense) continue;
      const expense = item.expense;
      if (!isValidYmd(expense.date)) throw new Error(`#${item.sourceIndex} has an invalid calendar date.`);
      const category = categories.get(expense.categoryId);
      if (!category) throw new Error(`#${item.sourceIndex} uses an unknown expense category.`);
      const subCategoryId = expense.subCategoryId || null;
      if (subCategoryId && subcategoryParents.get(subCategoryId) !== category.id) throw new Error(`#${item.sourceIndex} uses a subcategory outside its category.`);
      const currencyId = expense.currencyId || context.defaultCurrency?.id || null;
      if (currencyId && !currencyMap.has(currencyId)) throw new Error(`#${item.sourceIndex} uses an unknown currency.`);
      expenses.push({
        sourceIndex: item.sourceIndex, rawText: item.rawText, amount: Math.round(expense.amount * 100) / 100,
        date: expense.date, description: expense.description.trim().slice(0, 255), categoryId: category.id, subCategoryId, currencyId,
        originalAmount: expense.originalAmount || null, exchangeRate: expense.exchangeRate || null, categoryName: category.name,
        subcategoryName: category.subcategories.find((x) => x.id === subCategoryId)?.name || null,
        currencyCode: currencyId ? currencyMap.get(currencyId)?.currencyCode || null : null,
      });
    }
    const warnings: Review["warnings"] = [];
    if (expenses.length) {
      const dates = expenses.map((x) => x.date).sort();
      const existing = await prisma.expenses.findMany({ where: { user_id: userId, date: { gte: parseDateForDb(dates[0]), lte: parseDateForDb(dates[dates.length - 1]) } }, select: { date: true, amount: true, description: true, currencyId: true } });
      for (const expense of expenses) {
        const duplicate = existing.some((x) => toYmd(x.date) === expense.date && Number(x.amount) === expense.amount && (x.description || "").trim().toLocaleLowerCase() === expense.description.trim().toLocaleLowerCase() && (x.currencyId || null) === expense.currencyId);
        if (duplicate) warnings.push({ sourceIndex: expense.sourceIndex, message: "A matching saved expense already exists. Verify this is not a duplicate." });
      }
    }
    const excluded = items.filter((x) => x.classification !== "expense").map((x) => ({ sourceIndex: x.sourceIndex, rawText: x.rawText, classification: x.classification, reason: x.reason }));
    const excludedCounts = excluded.reduce<Partial<Record<Classification, number>>>((counts, x) => { counts[x.classification] = (counts[x.classification] || 0) + 1; return counts; }, {});
    const totalsByCurrency = expenses.reduce<Record<string, number>>((totals, x) => { const key = x.currencyCode || "DEFAULT"; totals[key] = Math.round(((totals[key] || 0) + x.amount) * 100) / 100; return totals; }, {});
    const tokenPayload: ReviewTokenPayload = {
      version: 1, userId, expiresAt: Date.now() + REVIEW_TOKEN_TTL_MS, sourceCount, excludedCounts,
      expenses: expenses.map(({ categoryName: _a, subcategoryName: _b, currencyCode: _c, ...expense }) => expense),
    };
    const review = { status: "ready_for_confirmation", sourceCount, accountedForCount: items.length, expenses, excluded, excludedCounts, warnings, totalsByCurrency, reviewToken: encodeReviewToken(tokenPayload), expiresAt: new Date(tokenPayload.expiresAt).toISOString() };
    return jsonResult(review, renderReviewText(review));
  });

  server.registerTool("commit_transaction_import", {
    title: "Commit transaction import",
    description: "Insert exactly the expenses in a signed preview token. Call only after explicit user confirmation. The token expires after 15 minutes; preview again after any requested change.",
    inputSchema: { reviewToken: z.string().min(20) },
    annotations: { destructiveHint: false, idempotentHint: false, openWorldHint: false },
  }, async ({ reviewToken }, extra) => {
    requireScope(extra, "transactions:write");
    const payload = decodeReviewToken(reviewToken, requireUserId(extra));
    if (!payload.expenses.length) throw new Error("The reviewed batch contains no expenses to save.");
    const categories = await prisma.expense_category.findMany({ where: { user_id: payload.userId }, select: { id: true, expense_subcategory: { select: { id: true } } } });
    const categoryIds = new Set(categories.map((x) => x.id));
    const subcategoryParents = new Map<string, string>();
    for (const category of categories) for (const subcategory of category.expense_subcategory) subcategoryParents.set(subcategory.id, category.id);
    const currencyIds = new Set((await prisma.currency.findMany({ select: { id: true } })).map((x) => x.id));
    for (const expense of payload.expenses) {
      if (!isValidYmd(expense.date) || !categoryIds.has(expense.categoryId)) throw new Error("Reviewed data is no longer valid. Preview again.");
      if (expense.subCategoryId && subcategoryParents.get(expense.subCategoryId) !== expense.categoryId) throw new Error("A reviewed subcategory is no longer valid. Preview again.");
      if (expense.currencyId && !currencyIds.has(expense.currencyId)) throw new Error("A reviewed currency is no longer valid. Preview again.");
    }
    const neutralEmotion = (await prisma.emotion.findFirst({ where: { emotion_type: "neutral" }, select: { id: true }, orderBy: { id: "asc" } })) || { id: 9 };
    const createdAt = new Date();
    const rows: Prisma.expensesCreateManyInput[] = payload.expenses.map((x) => ({ user_id: payload.userId, amount: x.amount, description: x.description, category_id: x.categoryId, subcategory_id: x.subCategoryId, date: parseDateForDb(x.date), created_at: createdAt, satisfaction: 3, emotion_id: neutralEmotion.id, currencyId: x.currencyId, original_amount: x.originalAmount, exchange_rate: x.exchangeRate }));
    const result = await prisma.$transaction(async (tx) => { const inserted = await tx.expenses.createMany({ data: rows }); await tx.users.update({ where: { id: payload.userId }, data: { last_updated: createdAt } }); return inserted; });
    const receipt = { status: "committed", createdCount: result.count, sourceCount: payload.sourceCount, excludedCounts: payload.excludedCounts, committedAt: createdAt.toISOString() };
    return jsonResult(receipt, `Saved ${result.count} confirmed expense(s). Excluded source items were not inserted.`);
  });

  server.registerTool("get_summary", {
    title: "Get spending summary", description: "Get expense totals and category breakdown for a month.",
    inputSchema: { month: z.number().int().min(1).max(12).optional(), year: z.number().int().min(2000).max(2200).optional() }, annotations: { readOnlyHint: true, openWorldHint: false },
  }, async ({ month, year }, extra) => {
    const now = new Date(); const selectedMonth = month || now.getMonth() + 1; const selectedYear = year || now.getFullYear();
    const expenses = await prisma.expenses.findMany({ where: { user_id: requireUserId(extra), date: { gte: new Date(Date.UTC(selectedYear, selectedMonth - 1, 1)), lt: new Date(Date.UTC(selectedYear, selectedMonth, 1)) } }, select: { amount: true, expensecategory: { select: { name: true } } } });
    const byCategory = expenses.reduce<Record<string, { total: number; count: number }>>((summary, x) => { const name = x.expensecategory?.name || "Uncategorized"; summary[name] ||= { total: 0, count: 0 }; summary[name].total += Number(x.amount); summary[name].count += 1; return summary; }, {});
    const total = expenses.reduce((sum, x) => sum + Number(x.amount), 0);
    return jsonResult({ month: selectedMonth, year: selectedYear, count: expenses.length, total, byCategory }, `Spending for ${selectedYear}-${String(selectedMonth).padStart(2, "0")}: ${expenses.length} expense(s), total ${total.toFixed(2)}.`);
  });

  server.registerTool("get_dashboard_link", { title: "Get Track My Spend links", description: "Return dashboard URLs.", inputSchema: {}, annotations: { readOnlyHint: true, openWorldHint: false } }, async () => jsonResult({ dashboard: "https://trackmyspend.co/en/dashboard", expenses: "https://trackmyspend.co/en/dashboard/expenses", income: "https://trackmyspend.co/en/dashboard/income", savings: "https://trackmyspend.co/en/dashboard/savings" }, "Track My Spend dashboard: https://trackmyspend.co/en/dashboard"));
}, { serverInfo: { name: "track-my-spend", version: "3.0.0" } }, { basePath: "/api", maxDuration: 60, disableSse: true });

const authenticatedHandler = withMcpAuth(handler, async (_request, bearerToken) => {
  if (!bearerToken) return undefined;
  try {
    await ensureOAuthTokenTable(prisma);
    const token = await prisma.mcp_oauth_token.findUnique({ where: { token_hash: hashToken(bearerToken) } });
    if (!token || token.token_type !== "access_token" || token.resource !== MCP_RESOURCE || token.revoked_at || token.expires_at <= new Date()) return undefined;
    const user = await prisma.users.findUnique({ where: { id: token.user_id }, select: { id: true, fully_signed_up: true } });
    if (!user?.fully_signed_up) return undefined;
    return { token: bearerToken, clientId: token.client_id, scopes: token.scopes.split(" "), expiresAt: Math.floor(token.expires_at.getTime() / 1000), resource: new URL(token.resource), extra: { userId: token.user_id } };
  } catch { return undefined; }
}, { required: true, requiredScopes: ["transactions:read"], resourceMetadataPath: "/.well-known/oauth-protected-resource/api/mcp", resourceUrl: MCP_RESOURCE });

export { authenticatedHandler as GET, authenticatedHandler as POST };
