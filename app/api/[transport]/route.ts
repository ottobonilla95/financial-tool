import { createMcpHandler } from "mcp-handler";
import { PrismaClient, Prisma } from "@prisma/client";
import OpenAI from "openai";
import { z } from "zod";

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MCP_USER_ID = process.env.MCP_USER_ID!;

type AiImportExpense = {
  amount: number;
  date: string;
  description: string;
  categoryId: string;
  subCategoryId?: string | null;
};

function toYmdLocal(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isValidYmd(dateStr: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}

function parseDateForDb(dateStr: string) {
  if (isValidYmd(dateStr)) {
    const [y, m, d] = dateStr.split("-").map((n) => Number(n));
    return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  }
  return new Date(dateStr);
}

async function fetchCategories(userId: string) {
  const data = await prisma.expense_category.findMany({
    select: {
      id: true,
      name: true,
      expense_subcategory: { select: { id: true, name: true } },
      color: true,
    },
    where: { user_id: userId },
  });
  return data.map((c) => ({
    id: c.id,
    name: c.name,
    color: c.color || "",
    subcategories: c.expense_subcategory.map((s) => ({ id: s.id, name: s.name })),
  }));
}

const handler = createMcpHandler(
  (server) => {
    // Tool: parse_expenses
    server.registerTool(
      "parse_expenses",
      {
        description:
          "Parse natural language text into structured expense entries using AI. Use this when the user describes spending in plain language. Returns parsed expenses for confirmation before saving.",
        inputSchema: {
          text: z
            .string()
            .describe(
              "Natural language text describing expenses, e.g. 'Last Friday I spent $50 on food, $35 on rent'"
            ),
          baseDate: z
            .string()
            .optional()
            .describe(
              "Reference date in YYYY-MM-DD format for relative date parsing. Defaults to today."
            ),
          lang: z
            .enum(["en", "es"])
            .optional()
            .default("en")
            .describe("Language of the input text: 'en' or 'es'"),
        },
      },
      async ({ text, baseDate, lang }) => {
        const userId = MCP_USER_ID;
        const categories = await fetchCategories(userId);

        if (!categories.length) {
          return {
            content: [
              { type: "text" as const, text: "Error: No expense categories found for this user." },
            ],
          };
        }

        const baseDateObj =
          baseDate && isValidYmd(baseDate) ? parseDateForDb(baseDate) : new Date();
        const defaultDate = new Date(baseDateObj.getFullYear(), baseDateObj.getMonth(), 1);
        const fallbackCategoryId = categories[0].id;

        const prompt = `
You extract expense records from messy user text.

Rules:
- Return ONLY valid JSON.
- Extract as many expenses as you can.
- If an item has NO numeric amount, do NOT include it in expenses; add it to "skipped".
- Amounts may be negative (like "-EUR 5.72" or "-5.72"). Treat them as positive values (use the absolute value).
- Dates can appear as "headers" that apply to multiple items. If a line (or phrase) specifies a date and the following items don't include a date, they should inherit the most recently mentioned date until another date appears.
- If an item has no date AND there is no prior date context, set date = "${toYmdLocal(defaultDate)}" (first day of the current month in context).
- If the text includes a day+month but no year, use year ${defaultDate.getFullYear()}.
- If the text includes a month name (e.g., April/Abril), use that month.
- Normalize date to "YYYY-MM-DD".
- Choose categoryId/subCategoryId from the provided list. If unsure, set categoryId = "${fallbackCategoryId}" and subCategoryId = null.
- description should be short and human-readable (merchant + note).

Example:
Input:
12 December
Supermarket 11.20
Coffee 3.50
11 December
Taxi 12

Then:
- Supermarket and Coffee use 12 December
- Taxi uses 11 December

You MUST use ONLY these categories/subcategories (IDs are required):
${JSON.stringify(
  categories.map((c) => ({
    id: c.id,
    name: c.name,
    subcategories: (c.subcategories ?? []).map((s) => ({ id: s.id, name: s.name })),
  })),
  null,
  2
)}

Output schema:
{
  "expenses": [
    {
      "amount": 12.34,
      "date": "YYYY-MM-DD",
      "description": "string",
      "categoryId": "uuid",
      "subCategoryId": "uuid|null"
    }
  ],
  "skipped": [
    { "raw": "string", "reason": "string" }
  ]
}

Text to parse (${lang}):
${text}
`;

        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 4000,
          response_format: { type: "json_object" },
        });

        const raw = response.choices[0].message.content?.trim() || "{}";
        let parsed: { expenses?: AiImportExpense[]; skipped?: { raw: string; reason: string }[] };
        try {
          parsed = JSON.parse(raw);
        } catch {
          return {
            content: [{ type: "text" as const, text: `Error: AI returned invalid JSON.` }],
          };
        }

        // Validate and clean parsed expenses
        const categoryIdSet = new Set(categories.map((c) => c.id));
        const subCategoryToCategory = new Map<string, string>();
        for (const c of categories) {
          for (const s of c.subcategories ?? []) subCategoryToCategory.set(s.id, c.id);
        }

        const safeExpenses: AiImportExpense[] = [];
        const safeSkipped = Array.isArray(parsed.skipped) ? parsed.skipped : [];

        for (const e of Array.isArray(parsed.expenses) ? parsed.expenses : []) {
          const rawAmount = Number(e.amount);
          const amount = Math.abs(rawAmount);
          if (!Number.isFinite(amount) || amount <= 0) {
            safeSkipped.push({ raw: JSON.stringify(e), reason: "Invalid amount" });
            continue;
          }

          const dateStr = typeof e.date === "string" ? e.date : "";
          const date = isValidYmd(dateStr) ? dateStr : toYmdLocal(defaultDate);

          let categoryId = typeof e.categoryId === "string" ? e.categoryId : fallbackCategoryId;
          if (!categoryIdSet.has(categoryId)) categoryId = fallbackCategoryId;

          let subCategoryId = typeof e.subCategoryId === "string" ? e.subCategoryId : null;
          if (subCategoryId) {
            const parent = subCategoryToCategory.get(subCategoryId);
            if (!parent || parent !== categoryId) subCategoryId = null;
          }

          safeExpenses.push({
            amount: Math.round(amount * 100) / 100,
            date,
            description: (e.description || "").toString().slice(0, 140),
            categoryId,
            subCategoryId,
          });
        }

        if (safeExpenses.length === 0) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Could not parse any expenses from the text.${safeSkipped.length ? `\n\nSkipped:\n${safeSkipped.map((s) => `- ${s.raw}: ${s.reason}`).join("\n")}` : ""}`,
              },
            ],
          };
        }

        // Format for user confirmation
        const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
        const lines = safeExpenses.map((e, i) => {
          const catName = categoryMap.get(e.categoryId) || "Unknown";
          return `${i + 1}. $${e.amount.toFixed(2)} — ${e.description} (${catName}) — ${e.date}`;
        });

        const total = safeExpenses.reduce((sum, e) => sum + e.amount, 0);

        const jsonPayload = JSON.stringify(safeExpenses);

        return {
          content: [
            {
              type: "text" as const,
              text: `Parsed ${safeExpenses.length} expense(s) — Total: $${total.toFixed(2)}\n\n${lines.join("\n")}${safeSkipped.length ? `\n\nSkipped:\n${safeSkipped.map((s) => `- ${s.raw}: ${s.reason}`).join("\n")}` : ""}\n\nTo save these, call save_expenses with this data:\n${jsonPayload}`,
            },
          ],
        };
      }
    );

    // Tool: save_expenses
    server.registerTool(
      "save_expenses",
      {
        description:
          "Save parsed expenses to the database. Use this AFTER parse_expenses to save confirmed expenses. Takes the JSON array from parse_expenses output.",
        inputSchema: {
          expenses: z
            .string()
            .describe(
              'JSON string of expenses array from parse_expenses output, e.g. [{"amount":50,"date":"2026-02-10","description":"Food","categoryId":"uuid","subCategoryId":null}]'
            ),
        },
      },
      async ({ expenses: expensesJson }) => {
        const userId = MCP_USER_ID;

        let expenses: AiImportExpense[];
        try {
          expenses = JSON.parse(expensesJson);
        } catch {
          return {
            content: [{ type: "text" as const, text: "Error: Invalid JSON for expenses." }],
          };
        }

        if (!Array.isArray(expenses) || expenses.length === 0) {
          return {
            content: [{ type: "text" as const, text: "Error: No expenses to save." }],
          };
        }

        if (expenses.length > 200) {
          return {
            content: [{ type: "text" as const, text: "Error: Too many expenses (max 200)." }],
          };
        }

        const categories = await fetchCategories(userId);
        const fallbackCategoryId = categories[0]?.id;
        const categoryIdSet = new Set(categories.map((c) => c.id));
        const subCategoryToCategory = new Map<string, string>();
        for (const c of categories) {
          for (const s of c.subcategories ?? []) subCategoryToCategory.set(s.id, c.id);
        }

        const neutralEmotion =
          (await prisma.emotion.findFirst({
            where: { emotion_type: "neutral" },
            select: { id: true },
            orderBy: { id: "asc" },
          })) || { id: 9 };

        const now = new Date();
        const rowsToCreate: Prisma.expensesCreateManyInput[] = [];
        const skipped: { index: number; reason: string }[] = [];

        expenses.forEach((e, index) => {
          const amount = Number(e.amount);
          if (!Number.isFinite(amount) || amount <= 0) {
            skipped.push({ index, reason: "Invalid amount" });
            return;
          }

          const dateStr = typeof e.date === "string" ? e.date : "";
          const dateObj = dateStr ? parseDateForDb(dateStr) : null;
          if (!dateObj || Number.isNaN(dateObj.getTime())) {
            skipped.push({ index, reason: "Invalid date" });
            return;
          }

          let categoryId = typeof e.categoryId === "string" ? e.categoryId : fallbackCategoryId;
          if (!categoryIdSet.has(categoryId)) categoryId = fallbackCategoryId;

          let subCategoryId = typeof e.subCategoryId === "string" ? e.subCategoryId : null;
          if (subCategoryId) {
            const parent = subCategoryToCategory.get(subCategoryId);
            if (!parent || parent !== categoryId) subCategoryId = null;
          }

          rowsToCreate.push({
            user_id: userId,
            amount: Math.round(amount * 100) / 100,
            description: (e.description || "").toString().slice(0, 255),
            category_id: categoryId,
            subcategory_id: subCategoryId,
            date: dateObj,
            created_at: now,
            satisfaction: 3,
            emotion_id: neutralEmotion.id,
          });
        });

        if (!rowsToCreate.length) {
          return {
            content: [
              {
                type: "text" as const,
                text: `No valid expenses to save.${skipped.length ? ` Skipped: ${skipped.map((s) => `#${s.index + 1}: ${s.reason}`).join(", ")}` : ""}`,
              },
            ],
          };
        }

        const result = await prisma.expenses.createMany({ data: rowsToCreate });

        // Update user's last_updated timestamp
        await prisma.users.update({
          data: { last_updated: new Date() },
          where: { id: userId },
        });

        return {
          content: [
            {
              type: "text" as const,
              text: `Saved ${result.count} expense(s) successfully!${skipped.length ? `\nSkipped: ${skipped.map((s) => `#${s.index + 1}: ${s.reason}`).join(", ")}` : ""}`,
            },
          ],
        };
      }
    );

    // Tool: get_summary
    server.registerTool(
      "get_summary",
      {
        description:
          "Get a summary of spending for the current month or a specific period. Use this when the user asks about their spending, totals, or budget status.",
        inputSchema: {
          month: z
            .number()
            .optional()
            .describe("Month number (1-12). Defaults to current month."),
          year: z
            .number()
            .optional()
            .describe("Year (e.g. 2026). Defaults to current year."),
        },
      },
      async ({ month, year }) => {
        const userId = MCP_USER_ID;
        const now = new Date();
        const m = month || now.getMonth() + 1;
        const y = year || now.getFullYear();

        const startDate = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0));
        const endDate = new Date(Date.UTC(y, m, 0, 23, 59, 59));

        const expenses = await prisma.expenses.findMany({
          where: {
            user_id: userId,
            date: { gte: startDate, lte: endDate },
          },
          include: {
            expensecategory: { select: { name: true } },
          },
          orderBy: { date: "desc" },
        });

        if (!expenses.length) {
          const monthName = startDate.toLocaleString("en", { month: "long" });
          return {
            content: [
              { type: "text" as const, text: `No expenses found for ${monthName} ${y}.` },
            ],
          };
        }

        const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

        // Group by category
        const byCategory = new Map<string, { name: string; total: number; count: number }>();
        for (const e of expenses) {
          const catName = e.expensecategory?.name || "Uncategorized";
          const existing = byCategory.get(catName);
          if (existing) {
            existing.total += Number(e.amount);
            existing.count++;
          } else {
            byCategory.set(catName, { name: catName, total: Number(e.amount), count: 1 });
          }
        }

        const sortedCategories = Array.from(byCategory.values()).sort(
          (a, b) => b.total - a.total
        );

        const monthName = startDate.toLocaleString("en", { month: "long" });
        const catLines = sortedCategories
          .map((c) => `  ${c.name}: $${c.total.toFixed(2)} (${c.count} expenses)`)
          .join("\n");

        return {
          content: [
            {
              type: "text" as const,
              text: `Spending summary for ${monthName} ${y}:\n\nTotal: $${total.toFixed(2)}\nExpenses: ${expenses.length}\n\nBy category:\n${catLines}`,
            },
          ],
        };
      }
    );

    // Tool: get_dashboard_link
    server.registerTool(
      "get_dashboard_link",
      {
        description:
          "Get the link to the TrackMySpend dashboard. Use this when the user asks to see their spending dashboard, charts, or reports.",
        inputSchema: {},
      },
      async () => {
        return {
          content: [
            {
              type: "text" as const,
              text: `Here's your TrackMySpend dashboard:\n\n📊 Dashboard: https://trackmyspend.co/en/dashboard\n💰 Expenses: https://trackmyspend.co/en/dashboard/expenses\n📈 Income: https://trackmyspend.co/en/dashboard/income\n💵 Savings: https://trackmyspend.co/en/dashboard/savings`,
            },
          ],
        };
      }
    );
  },
  {},
  {
    basePath: "/api",
    maxDuration: 60,
  }
);

export { handler as GET, handler as POST };
