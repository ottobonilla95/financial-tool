import { Currency } from "@/src/types";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export type Data = {
  id: string;
  name: string;
  email: string;
  last_updated: Date;
  password: string;
  currency?: Currency;
};

type UpdateUserDataProps = {
  filters: Prisma.usersWhereUniqueInput;
  data: Prisma.usersUpdateInput;
};

export async function updateDBUser({ filters, data }: UpdateUserDataProps) {
  try {
    await prisma.users.update({
      data,
      where: filters,
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update user.");
  }
}
