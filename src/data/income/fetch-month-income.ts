import { PrismaClient } from "@prisma/client";
import { startOfMonth, endOfMonth } from "date-fns";
import { Income } from "@/src/types";

const prisma = new PrismaClient();

export type Data = {
  id: string;
  amount: number;
  description: string | null;
  earning_date: Date | null;
  earning_category: {
    id: string;
    name: string;
    color: string | null;
  } | null;
  earning_subcategory: {
    id: string;
    name: string;
  } | null;
};

export async function fetchMonthIncome(
  userId: string,
  month: number,
  year: number
) {
  const startDate = startOfMonth(new Date(year, month - 1));
  const endDate = endOfMonth(new Date(year, month - 1));

  try {
    const data = await prisma.earning.findMany({
      select: {
        id: true,
        amount: true,
        earning_date: true,
        description: true,
        earning_category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        earning_subcategory: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        user_id: userId,
        earning_date: {
          gte: startDate.toISOString(),
          lte: endDate.toISOString(),
        },
      },
    });

    const incomes = data.map((income) =>
      mapIncome({ ...income, amount: Number(income.amount) })
    );
    return incomes;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest incomes.");
  }
}

export const mapIncome = (income: Data): Income => {
  return {
    id: income.id,
    incomeDate: new Date(income.earning_date || ""),
    description: income.description || "",
    amount: income.amount,
    category: {
      id: income.earning_category?.id || "",
      name: income.earning_category?.name || "",
      color: income.earning_category?.color || "",
    },
    subcategory: {
      id: income.earning_subcategory?.id || "",
      name: income.earning_subcategory?.name || "",
    },
  };
};
