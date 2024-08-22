import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type UpdateDBCategoryProps = {
  id: string;
  userId: string;
  name: string;
  color: string;
};

export async function updateDBCategory({
  id,
  userId,
  name,
  color,
}: UpdateDBCategoryProps) {
  try {
    await prisma.expense_category.update({
      data: {
        name,
        color,
      },
      where: {
        id,
        user_id: userId,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update category.");
  }
}
