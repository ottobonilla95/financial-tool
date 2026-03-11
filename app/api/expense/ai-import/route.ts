import { NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@/auth";
import { fetchExpensesCategories } from "@/src/data/expense-category";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type AiImportExpense = {
  amount: number;
  date: string; // YYYY-MM-DD
  description: string;
  categoryId: string;
  subCategoryId?: string | null;
};

type AiImportSkipped = {
  raw: string;
  reason: string;
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

function parseYmdToLocal(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map((n) => Number(n));
  return new Date(y, m - 1, d);
}

export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id as string | undefined;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as {
      text?: string;
      baseDate?: string; // YYYY-MM-DD
      lang?: string;
    };

    const text = (body.text || "").trim();
    if (!text) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    const categories = await fetchExpensesCategories(userId);
    if (!categories.length) {
      return NextResponse.json(
        { error: "No categories found for user" },
        { status: 400 }
      );
    }

    const baseDate =
      body.baseDate && isValidYmd(body.baseDate)
        ? parseYmdToLocal(body.baseDate)
        : new Date();
    // Default date when missing: 1st of base month
    const defaultDate = new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      1
    );

    const fallbackCategoryId = categories[0].id;
    const lang = body.lang === "es" ? "es" : "en";

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
    subcategories: (c.subcategories ?? []).map((s) => ({
      id: s.id,
      name: s.name,
    })),
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
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4000,
      response_format: { type: "json_object" },
    });

    const raw = response.choices[0].message.content?.trim() || "{}";
    let parsed: { expenses?: AiImportExpense[]; skipped?: AiImportSkipped[] };
    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "Invalid AI response format", rawResponse: raw },
        { status: 500 }
      );
    }

    const categoryIdSet = new Set(categories.map((c) => c.id));
    const subCategoryToCategory = new Map<string, string>();
    for (const c of categories) {
      for (const s of c.subcategories ?? [])
        subCategoryToCategory.set(s.id, c.id);
    }

    const safeExpenses: AiImportExpense[] = [];
    const safeSkipped: AiImportSkipped[] = Array.isArray(parsed.skipped)
      ? parsed.skipped
      : [];

    for (const e of Array.isArray(parsed.expenses) ? parsed.expenses : []) {
      const rawAmount = Number(e.amount);
      const amount = Math.abs(rawAmount); // handle negative amounts
      if (!Number.isFinite(amount) || amount <= 0) {
        safeSkipped.push({
          raw: JSON.stringify(e),
          reason: "Missing or invalid amount",
        });
        continue;
      }

      const dateStr = typeof e.date === "string" ? e.date : "";
      const date = isValidYmd(dateStr) ? dateStr : toYmdLocal(defaultDate);

      let categoryId =
        typeof e.categoryId === "string" ? e.categoryId : fallbackCategoryId;
      if (!categoryIdSet.has(categoryId)) categoryId = fallbackCategoryId;

      let subCategoryId =
        typeof e.subCategoryId === "string" ? e.subCategoryId : null;
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

    return NextResponse.json({
      expenses: safeExpenses,
      skipped: safeSkipped,
      meta: {
        fallbackCategoryId,
        defaultDate: toYmdLocal(defaultDate),
      },
    });
  } catch (error: any) {
    console.error("AI expense import error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

