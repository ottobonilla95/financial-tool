import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type UpdateToCreate = {
  id: string;
  userId: string;
  amount: number;
  description: string;
  categoryId: string;
  subCategoryId?: string;
  date: Date;
};

export async function updateDbEarning({
  id,
  userId,
  amount,
  description,
  categoryId,
  subCategoryId,
  date,
}: UpdateToCreate) {
  try {
    await prisma.earning.update({
      data: {
        amount,
        description,
        category_id: categoryId,
        subcategory_id: subCategoryId || null,
        date,
        created_at: new Date(),
      },
      where: { id, user_id: userId },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to udpate earning.");
  }
}
