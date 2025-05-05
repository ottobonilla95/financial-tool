import { PrismaClient, Prisma } from "@prisma/client";
import { Expense } from "@/src/types";

const prisma = new PrismaClient();

export type Data = {
  id: string;
  amount: number;
  description: string | null;
  date: Date | null;
  expensecategory: {
    id: string;
    name: string;
    color: string | null;
  } | null;
  expensesubcategory: {
    id: string;
    name: string;
  } | null;
  satisfaction: number | null;
  emotion: {
    id: number;
    emotion_type: string;
    name: string;
    color: string | null;
  } | null;
  created_at: Date | null;
  original_amount: number | null;
  exchange_rate: number | null;
  currency: {
    id: string;
    name: string;
    symbol: string;
    currencyCode: string;
  } | null;
};

type FetchExpensesProps = {
  filters?: Prisma.expensesWhereInput;
};

export async function fetchExpenses({ filters }: FetchExpensesProps) {
  try {
    const data = await prisma.expenses.findMany({
      select: {
        id: true,
        amount: true,
        date: true,
        description: true,
        expensecategory: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        expensesubcategory: {
          select: {
            id: true,
            name: true,
          },
        },
        satisfaction: true,
        emotion: {
          select: {
            id: true,
            emotion_type: true,
            name: true,
            color: true,
          },
        },
        created_at: true,
        original_amount: true,
        exchange_rate: true,
        currency: {
          select: {
            id: true,
            name: true,
            symbol: true,
            currencyCode: true,
          },
        },
      },
      where: filters,
      orderBy: {
        date: "asc",
      },
    });

    const expenses = data.map((expense) =>
      mapExpense({
        ...expense,
        amount: Number(expense.amount),
        original_amount: expense.original_amount
          ? Number(expense.original_amount)
          : null,
        exchange_rate: expense.exchange_rate
          ? Number(expense.exchange_rate)
          : null,
        currency: expense.currency
          ? {
              ...expense.currency,
              id: String(expense.currency.id),
              currencyCode: expense.currency.currencyCode || "",
            }
          : null,
      })
    );
    return expenses;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest expenses.");
  }
}

export const mapExpense = (expense: Data): Expense => {
  const dateFromPrisma = new Date(expense.date?.toISOString() || "");
  const correctDate = new Date(
    Date.UTC(
      dateFromPrisma.getUTCFullYear(),
      dateFromPrisma.getUTCMonth(),
      dateFromPrisma.getUTCDate()
    )
  );

  return {
    id: expense.id,
    date: correctDate,
    description: expense.description || "",
    amount: expense.amount,
    category: {
      id: expense.expensecategory?.id || "",
      name: expense.expensecategory?.name || "",
      color: expense.expensecategory?.color || "",
    },
    subcategory: {
      id: expense.expensesubcategory?.id || "",
      name: expense.expensesubcategory?.name || "",
    },
    satisfaction: expense.satisfaction || 0,
    emotion: {
      id: expense.emotion?.id || 0,
      emotionType: expense.emotion?.emotion_type || "",
      name: expense.emotion?.name || "",
      color: expense.emotion?.color || "",
    },
    formattedDate: `${expense.date?.toUTCString().split(",")[0]} ${String(
      expense.date?.getUTCDate()
    ).padStart(2, "0")}`,
    createdAt: expense.created_at || new Date(),
    originalAmount: expense.original_amount || 0,
    exchangeRate: expense.exchange_rate || 0,
    currency: expense.currency
      ? {
          id: Number(expense.currency.id),
          name: expense.currency.name || "",
          symbol: expense.currency.symbol || "",
          currencyCode: expense.currency.currencyCode || "",
        }
      : undefined,
  };
};
