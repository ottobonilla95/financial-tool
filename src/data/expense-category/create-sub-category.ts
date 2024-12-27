import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type createDBSubCategoryProps = {
  name: string;
  categoryId: string;
  userId: string;
};

export async function createDBSubCategory({
  name,
  categoryId,
  userId,
}: createDBSubCategoryProps) {
  try {
    await prisma.expense_subcategory.create({
      data: {
        category_id: categoryId,
        name,
        created_at: new Date(),
        user_id: userId,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create sub category.");
  }
}
