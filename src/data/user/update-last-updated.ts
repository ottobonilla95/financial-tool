import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type UpdateLastUpdatedProps = {
  userId: string;
};

export async function updateLastUpdated({ userId }: UpdateLastUpdatedProps) {
  try {
    await prisma.users.update({
      data: {
        last_updated: new Date(),
      },
      where: {
        id: userId,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create expense.");
  }
}
