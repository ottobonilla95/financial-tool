import { PrismaClient } from "@prisma/client";
import { startOfMonth, endOfMonth } from "date-fns";
import { Saving } from "@/src/types";

const prisma = new PrismaClient();

export type Data = {
  id: string;
  amount: number;
  description: string | null;
  saving_date: Date;
};

export async function fetchMonthSaving(
  userId: string,
  month: number,
  year: number
) {
  const startDate = startOfMonth(new Date(year, month - 1));
  const endDate = endOfMonth(new Date(year, month - 1));

  try {
    const data = await prisma.saving.findMany({
      select: {
        id: true,
        amount: true,
        saving_date: true,
        description: true,
      },
      where: {
        user_id: userId,
        saving_date: {
          gte: startDate.toISOString(),
          lte: endDate.toISOString(),
        },
      },
      orderBy: {
        saving_date: "asc",
      },
    });

    const savings = data.map((saving) =>
      mapSaving({ ...saving, amount: Number(saving.amount) })
    );
    return savings;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest savings.");
  }
}

export const mapSaving = (saving: Data): Saving => {
  return {
    id: saving.id,
    savingDate: new Date(saving.saving_date || ""),
    description: saving.description || "",
    amount: saving.amount,
  };
};
