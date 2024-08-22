import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type CreateDBIncomeCategoryProps = {
  userId: string;
  name: string;
  color: string;
};

export async function createDBIncomeCategory({
  userId,
  name,
  color,
}: CreateDBIncomeCategoryProps) {
  try {
    await prisma.earning_category.create({
      data: {
        user_id: userId,
        name,
        color,
        created_at: new Date(),
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create category.");
  }
}
