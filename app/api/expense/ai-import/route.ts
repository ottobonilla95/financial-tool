import { NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@/auth";
import { fetchExpensesCategories } from "@/src/data/expense-category";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const EXPENSE_IMPORT_MODEL =
  process.env.OPENAI_EXPENSE_IMPORT_MODEL || "gpt-5.5";
const EXPENSE_IMPORT_MAX_OUTPUT_TOKENS = getPositiveIntegerEnv(
  "OPENAI_EXPENSE_IMPORT_MAX_OUTPUT_TOKENS",
  8000
);
const EXPENSE_IMPORT_MAX_INPUT_CHARS = getPositiveIntegerEnv(
  "OPENAI_EXPENSE_IMPORT_MAX_INPUT_CHARS",
  20000
);
const EXPENSE_IMPORT_TIMEOUT_MS = getPositiveIntegerEnv(
  "OPENAI_EXPENSE_IMPORT_TIMEOUT_MS",
  55000
);
const EXPENSE_IMPORT_REASONING_EFFORTS = ["low", "medium", "high"] as const;

const expenseImportResponseSchema = {
  type: "object",
  properties: {
    expenses: {
      type: "array",
      items: {
        type: "object",
        properties: {
          amount: { type: "number" },
          date: { type: "string" },
          description: { type: "string" },
          categoryId: { type: "string" },
          subCategoryId: { type: ["string", "null"] },
        },
        required: [
          "amount",
          "date",
          "description",
          "categoryId",
          "subCategoryId",
        ],
        additionalProperties: false,
      },
    },
    skipped: {
      type: "array",
      items: {
        type: "object",
        properties: {
          raw: { type: "string" },
          reason: { type: "string" },
        },
        required: ["raw", "reason"],
        additionalProperties: false,
      },
    },
  },
  required: ["expenses", "skipped"],
  additionalProperties: false,
} as const;

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

type OpenAIResponseOutputContent = { text?: unknown };
type OpenAIResponseOutputItem = { content?: OpenAIResponseOutputContent[] };
type UserExpenseCategory = Awaited<
  ReturnType<typeof fetchExpensesCategories>
>[number];

function getPositiveIntegerEnv(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
}

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

function getResponseOutputText(response: {
  output_text?: unknown;
  output?: OpenAIResponseOutputItem[];
}) {
  if (typeof response.output_text === "string") return response.output_text;

  const output = Array.isArray(response.output) ? response.output : [];
  return output
    .flatMap((item) => (Array.isArray(item.content) ? item.content : []))
    .map((content) => content.text)
    .filter((text): text is string => typeof text === "string")
    .join("");
}

function getExpenseImportReasoningEffort() {
  const model = EXPENSE_IMPORT_MODEL.toLowerCase();
  if (!model.startsWith("o")) return undefined;

  const effort = (
    process.env.OPENAI_EXPENSE_IMPORT_REASONING_EFFORT || "low"
  ).toLowerCase();

  return EXPENSE_IMPORT_REASONING_EFFORTS.includes(
    effort as (typeof EXPENSE_IMPORT_REASONING_EFFORTS)[number]
  )
    ? effort
    : "low";
}

function normalizeAiImportData({
  categories,
  defaultDate,
  parsed,
}: {
  categories: UserExpenseCategory[];
  defaultDate: Date;
  parsed: { expenses?: AiImportExpense[]; skipped?: AiImportSkipped[] };
}) {
  const fallbackCategoryId = categories[0].id;
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

  return {
    expenses: safeExpenses,
    fallbackCategoryId,
    skipped: safeSkipped,
  };
}

function parseAiImportResponse(response: {
  output_text?: unknown;
  output?: OpenAIResponseOutputItem[];
}) {
  const raw = getResponseOutputText(response).trim() || "{}";
  try {
    return JSON.parse(raw) as {
      expenses?: AiImportExpense[];
      skipped?: AiImportSkipped[];
    };
  } catch {
    throw new Error("Invalid AI response format");
  }
}

export const maxDuration = 60;

export async function GET(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id as string | undefined;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const responseId = url.searchParams.get("responseId");
    if (!responseId) {
      return NextResponse.json({ error: "Missing responseId" }, { status: 400 });
    }

    const baseDateParam = url.searchParams.get("baseDate");
    const baseDate =
      baseDateParam && isValidYmd(baseDateParam)
        ? parseYmdToLocal(baseDateParam)
        : new Date();
    const defaultDate = new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      1
    );

    const response = await (openai as any).responses.retrieve(responseId, {
      timeout: 15000,
    });
    const status =
      typeof response.status === "string" ? response.status : "completed";

    if (status !== "completed") {
      if (status === "failed" || status === "cancelled" || status === "incomplete") {
        return NextResponse.json(
          { error: `AI import ${status}`, responseId, status },
          { status: 500 }
        );
      }

      return NextResponse.json({ responseId, status }, { status: 202 });
    }

    const categories = await fetchExpensesCategories(userId);
    if (!categories.length) {
      return NextResponse.json(
        { error: "No categories found for user" },
        { status: 400 }
      );
    }

    const parsed = parseAiImportResponse(response);
    const { expenses, fallbackCategoryId, skipped } = normalizeAiImportData({
      categories,
      defaultDate,
      parsed,
    });

    return NextResponse.json({
      expenses,
      skipped,
      meta: {
        fallbackCategoryId,
        defaultDate: toYmdLocal(defaultDate),
      },
    });
  } catch (error: any) {
    const message =
      typeof error?.message === "string" ? error.message : "Internal Server Error";
    console.error("AI expense import polling error:", {
      name: error?.name,
      message,
    });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

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
    if (text.length > EXPENSE_IMPORT_MAX_INPUT_CHARS) {
      return NextResponse.json(
        {
          error: `Text is too long to import at once. Please paste ${EXPENSE_IMPORT_MAX_INPUT_CHARS.toLocaleString()} characters or fewer.`,
        },
        { status: 413 }
      );
    }

    const startedAt = Date.now();
    console.info("AI expense import started", {
      model: EXPENSE_IMPORT_MODEL,
      textLength: text.length,
      timeoutMs: EXPENSE_IMPORT_TIMEOUT_MS,
    });

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

    const categoriesForPrompt = categories.map((c) => ({
      id: c.id,
      name: c.name,
      subcategories: (c.subcategories ?? []).map((s) => ({
        id: s.id,
        name: s.name,
      })),
    }));

    const systemPrompt = `
You extract expense records from messy bilingual user text for a budgeting app.

Rules:
- Return every distinct expense that has a numeric amount. Do not merge separate charges.
- A single line can contain multiple expenses; split each charge into its own expense.
- Extract up to 200 expenses.
- If an item has NO numeric amount, do NOT include it in expenses; add it to "skipped".
- Amounts may be negative (like "-EUR 5.72" or "-5.72"). Treat them as positive values (use the absolute value).
- Keep the original currency amount as the numeric amount. Do not convert currencies.
- Dates can appear as "headers" that apply to multiple items. If a line (or phrase) specifies a date and the following items don't include a date, they should inherit the most recently mentioned date until another date appears.
- If an item has no date AND there is no prior date context, set date = "${toYmdLocal(defaultDate)}" (first day of the current month in context).
- If the text includes a day+month but no year, use year ${defaultDate.getFullYear()}.
- Use base date "${toYmdLocal(baseDate)}" for relative dates like today, yesterday, last Friday, hoy, ayer, or el viernes pasado.
- If the text includes a month name (e.g., April/Abril), use that month.
- Normalize date to "YYYY-MM-DD".
- Choose categoryId/subCategoryId only from the provided category list.
- Prefer the most specific matching subcategory when the category/subcategory relationship is clear.
- If category is uncertain, set categoryId = "${fallbackCategoryId}" and subCategoryId = null.
- description should be short and human-readable (merchant + note).
- skipped.reason should briefly explain why the raw text was not an expense.

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
`;

    const userPrompt = `
Language: ${lang}
Allowed categories and subcategories:
${JSON.stringify(categoriesForPrompt, null, 2)}

Text to parse:
${text}
`;

    const reasoningEffort = getExpenseImportReasoningEffort();
    const aiStartedAt = Date.now();
    const responseRequest: Record<string, unknown> = {
      background: true,
      model: EXPENSE_IMPORT_MODEL,
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_output_tokens: EXPENSE_IMPORT_MAX_OUTPUT_TOKENS,
      text: {
        format: {
          type: "json_schema",
          name: "expense_import_response",
          strict: true,
          schema: expenseImportResponseSchema,
        },
      },
    };
    if (reasoningEffort) {
      responseRequest.reasoning = { effort: reasoningEffort };
    }

    const response = await (openai as any).responses.create(
      responseRequest as any,
      { timeout: EXPENSE_IMPORT_TIMEOUT_MS }
    );
    const aiDurationMs = Date.now() - aiStartedAt;

    const status =
      typeof response.status === "string" ? response.status : "completed";
    const responseId =
      typeof response.id === "string" ? response.id : undefined;

    if (status !== "completed") {
      if (!responseId) {
        return NextResponse.json(
          { error: "AI import started but did not return a response id" },
          { status: 500 }
        );
      }

      if (status === "failed" || status === "cancelled" || status === "incomplete") {
        return NextResponse.json(
          { error: `AI import ${status}`, responseId, status },
          { status: 500 }
        );
      }

      console.info("AI expense import queued", {
        model: EXPENSE_IMPORT_MODEL,
        durationMs: Date.now() - startedAt,
        responseId,
        status,
      });

      return NextResponse.json(
        {
          responseId,
          status,
          meta: {
            fallbackCategoryId,
            defaultDate: toYmdLocal(defaultDate),
          },
        },
        { status: 202 }
      );
    }

    const parsed = parseAiImportResponse(response);
    const { expenses, skipped } = normalizeAiImportData({
      categories,
      defaultDate,
      parsed,
    });

    console.info("AI expense import completed", {
      model: EXPENSE_IMPORT_MODEL,
      durationMs: Date.now() - startedAt,
      aiDurationMs,
      expenseCount: expenses.length,
      skippedCount: skipped.length,
    });

    return NextResponse.json({
      expenses,
      skipped,
      meta: {
        fallbackCategoryId,
        defaultDate: toYmdLocal(defaultDate),
      },
    });
  } catch (error: any) {
    const message =
      typeof error?.message === "string" ? error.message : "Internal Server Error";
    const isTimeout =
      error?.name === "APIConnectionTimeoutError" ||
      /timeout|timed out|aborted/i.test(message);

    console.error("AI expense import error:", {
      name: error?.name,
      message,
      model: EXPENSE_IMPORT_MODEL,
      timeoutMs: EXPENSE_IMPORT_TIMEOUT_MS,
    });

    return NextResponse.json(
      {
        error: isTimeout
          ? "AI import took too long. Try a smaller paste or try again."
          : message,
      },
      { status: isTimeout ? 504 : 500 }
    );
  }
}
