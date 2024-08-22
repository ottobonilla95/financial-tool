import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type UpdateDBIncomeCategoryProps = {
  id: string;
  userId: string;
  name: string;
  color: string;
};

export async function updateDBIncomeCategory({
  id,
  userId,
  name,
  color,
}: UpdateDBIncomeCategoryProps) {
  try {
    await prisma.earning_category.update({
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
