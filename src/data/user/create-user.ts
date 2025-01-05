import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type UserToCreate = {
  email: string;
  lang: string;
  systemeioId?: string;
};

export async function createDbUser({ email, lang, systemeioId }: UserToCreate) {
  try {
    const user = await prisma.users.create({
      data: {
        email,
        created_at: new Date(),
        lang,
        name: "",
        password: "",
        systemeio_id: systemeioId,
      },
    });
    return user;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create user.");
  }
}
