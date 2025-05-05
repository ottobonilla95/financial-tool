import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type ExpenseToCreate = {
  userId: string;
  amount: number;
  description: string;
  categoryId: string;
  subCategoryId?: string;
  date: Date;
  satisfaction: number;
  emotionId: number;
  currencyId?: number;
  originalAmount?: number;
  exchangeRate?: number;
};

export async function createDbExpense({
  userId,
  amount,
  description,
  categoryId,
  subCategoryId,
  date,
  satisfaction,
  emotionId,
  currencyId,
  originalAmount,
  exchangeRate,
}: ExpenseToCreate) {
  try {
    await prisma.expenses.create({
      data: {
        user_id: userId,
        amount,
        description,
        category_id: categoryId,
        subcategory_id: subCategoryId || null,
        date,
        created_at: new Date(),
        satisfaction,
        emotion_id: emotionId,
        currencyId,
        exchange_rate: exchangeRate,
        original_amount: originalAmount,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create expense.");
  }
}
