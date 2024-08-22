import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type CreateDBIncomeSubCategoryProps = {
  name: string;
  categoryId: string;
};

export async function createDBIncomeSubCategory({
  name,
  categoryId,
}: CreateDBIncomeSubCategoryProps) {
  try {
    await prisma.earning_subcategory.create({
      data: {
        category_id: categoryId,
        name,
        created_at: new Date(),
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create sub category.");
  }
}
