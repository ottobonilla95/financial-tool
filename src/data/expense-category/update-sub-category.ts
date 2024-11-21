import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type UpdateDBSubCategoryProps = {
  id: string;
  name: string;
};

export async function updateDBSubCategory({
  id,
  name,
}: UpdateDBSubCategoryProps) {
  try {
    await prisma.expense_subcategory.update({
      data: {
        name,
      },
      where: {
        id,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update category.");
  }
}
