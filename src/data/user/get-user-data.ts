import { User } from "@/src/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type Data = {
  name: string;
  last_updated: Date;
};

export async function getUserData(userId: string) {
  try {
    const user = await prisma.users.findFirst({
      where: {
        id: userId,
      },
      select: {
        name: true,
        last_updated: true,
      },
    });

    return mapUser(user as Data);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to get user.");
  }
}

export const mapUser = (user: Data): User => {
  return {
    lastUpdated: user.last_updated.toISOString(),
    name: user.name,
  };
};
