import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type DeleteDbEarningProps = {
  userId: string;
  incomeId: string;
};

export async function deleteDbEarning({
  userId,
  incomeId,
}: DeleteDbEarningProps) {
  try {
    await prisma.earning.delete({
      where: {
        user_id: userId,
        id: incomeId,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete earning.");
  }
}
