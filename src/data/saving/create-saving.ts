import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type SavingToCreate = {
  userId: string;
  amount: number;
  description: string;
  date: Date;
};

export async function createDbSaving({
  userId,
  amount,
  description,
  date,
}: SavingToCreate) {
  try {
    await prisma.saving.create({
      data: {
        user_id: userId,
        amount,
        date,
        description,
        created_at: new Date(),
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create saving.");
  }
}
