import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type ExpenseToUpdate = {
  userId: string;
  id: string;
  amount: number;
  description: string;
  categoryId: string;
  subCategoryId?: string;
  date: Date;
  satisfaction: number;
  emotionId: number;
};

export async function updateDbExpense({
  userId,
  id,
  amount,
  description,
  categoryId,
  subCategoryId,
  date,
  satisfaction,
  emotionId,
}: ExpenseToUpdate) {
  try {
    await prisma.expenses.update({
      data: {
        amount,
        description,
        category_id: categoryId,
        subcategory_id: subCategoryId || null,
        date,
        created_at: new Date(),
        satisfaction,
        emotion_id: emotionId,
      },
      where: {
        id,
        user_id: userId,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create expense.");
  }
}
