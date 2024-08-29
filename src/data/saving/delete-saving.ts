import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type DeleteDbSavingProps = {
  userId: string;
  savingId: string;
};

export async function deleteDbSaving({
  userId,
  savingId,
}: DeleteDbSavingProps) {
  try {
    await prisma.saving.delete({
      where: {
        user_id: userId,
        id: savingId,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete saving.");
  }
}
