import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type UserToCreate = {
  name: string;
  email: string;
  password: string;
  currencyId: string;
};

export async function createDbUser({
  name,
  email,
  password,
  currencyId,
}: UserToCreate) {
  try {
    await prisma.users.create({
      data: {
        name,
        email,
        password,
        created_at: new Date(),
        currency_id: Number(currencyId),
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create expense.");
  }
}
