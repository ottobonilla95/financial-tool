import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type ExpenseToCreate = {
  userId: string;
  amount: number;
  description: string;
  categoryId: string;
  subCategoryId: string;
  date: Date;
};

export async function createDbExpense({
  userId,
  amount,
  description,
  categoryId,
  subCategoryId,
  date,
}: ExpenseToCreate) {
  try {
    await prisma.expenses.create({
      data: {
        user_id: userId,
        amount,
        description,
        category_id: categoryId,
        subcategory_id: subCategoryId,
        expense_date: date,
        created_at: new Date(),
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create expense.");
  }
}
