import { NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { updateLastUpdated } from "@/src/data/user";
import { fetchExpensesCategories } from "@/src/data/expense-category";

const prisma = new PrismaClient();

type BulkExpense = {
  amount: number;
  date: string; // YYYY-MM-DD or ISO
  description?: string;
  categoryId: string;
  subCategoryId?: string | null;
  currencyId?: number | null;
};

function isValidYmd(dateStr: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}

// For date-only fields, store a stable timestamp (UTC noon) to avoid timezone shifting.
function parseDateForDb(dateStr: string) {
  if (isValidYmd(dateStr)) {
    const [y, m, d] = dateStr.split("-").map((n) => Number(n));
    return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  }
  return new Date(dateStr);
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id as string | undefined;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as { expenses?: BulkExpense[] };
    const expenses = Array.isArray(body.expenses) ? body.expenses : [];
    if (!expenses.length) {
      return NextResponse.json({ error: "Missing expenses" }, { status: 400 });
    }
    if (expenses.length > 200) {
      return NextResponse.json(
        { error: "Too many expenses (max 200)" },
        { status: 400 }
      );
    }

    const categories = await fetchExpensesCategories(userId);
    if (!categories.length) {
      return NextResponse.json(
        { error: "No categories found for user" },
        { status: 400 }
      );
    }
    const fallbackCategoryId = categories[0].id;

    const categoryIdSet = new Set(categories.map((c) => c.id));
    const subCategoryToCategory = new Map<string, string>();
    for (const c of categories) {
      for (const s of c.subcategories ?? [])
        subCategoryToCategory.set(s.id, c.id);
    }

    // Find a neutral emotion id (fallback to 9 to match existing UI default)
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

      let categoryId =
        typeof e.categoryId === "string" ? e.categoryId : fallbackCategoryId;
      if (!categoryIdSet.has(categoryId)) categoryId = fallbackCategoryId;

      let subCategoryId =
        typeof e.subCategoryId === "string" ? e.subCategoryId : null;
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
        currencyId:
          typeof e.currencyId === "number" && Number.isFinite(e.currencyId)
            ? e.currencyId
            : null,
      });
    });

    if (!rowsToCreate.length) {
      return NextResponse.json(
        { error: "No valid expenses to create", skipped },
        { status: 400 }
      );
    }

    const result = await prisma.expenses.createMany({
      data: rowsToCreate,
    });

    await updateLastUpdated({ userId });

    return NextResponse.json({
      success: true,
      createdCount: result.count,
      skipped,
    });
  } catch (error: any) {
    console.error("Bulk create expenses error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

