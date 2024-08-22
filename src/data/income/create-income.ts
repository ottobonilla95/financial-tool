import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type IncomeToCreate = {
  userId: string;
  amount: number;
  description: string;
  categoryId: string;
  subCategoryId?: string;
  date: Date;
};

export async function createDbIncome({
  userId,
  amount,
  description,
  categoryId,
  subCategoryId,
  date,
}: IncomeToCreate) {
  try {
    await prisma.earning.create({
      data: {
        user_id: userId,
        amount,
        description,
        category_id: categoryId,
        subcategory_id: subCategoryId || null,
        earning_date: date,
        created_at: new Date(),
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create income.");
  }
}
