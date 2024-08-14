import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type DeleteDbExpenseProps = {
  userId: string;
  expenseId: string;
};

export async function deleteDbExpense({
  userId,
  expenseId,
}: DeleteDbExpenseProps) {
  try {
    await prisma.expenses.delete({
      where: {
        user_id: userId,
        id: expenseId,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete expense.");
  }
}
