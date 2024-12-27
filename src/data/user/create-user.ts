import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type UserToCreate = {
  email: string;
  lang: string;
};

export async function createDbUser({ email, lang }: UserToCreate) {
  try {
    const user = await prisma.users.create({
      data: {
        email,
        created_at: new Date(),
        lang,
        name: "",
        password: "",
      },
    });
    return user;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create user.");
  }
}
