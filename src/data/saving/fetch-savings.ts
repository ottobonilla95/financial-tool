import { PrismaClient, Prisma } from "@prisma/client";
import { Saving } from "@/src/types";
import { format } from "date-fns";

const prisma = new PrismaClient();

export type Data = {
  id: string;
  amount: number;
  description: string | null;
  date: Date;
};

type FetchSavingsProps = {
  filters?: Prisma.savingWhereInput;
};

export async function fetchSavings({ filters }: FetchSavingsProps) {
  try {
    const data = await prisma.saving.findMany({
      select: {
        id: true,
        amount: true,
        date: true,
        description: true,
      },
      where: filters,
      orderBy: {
        date: "asc",
      },
    });

    const savings = data.map((saving) =>
      mapSaving({ ...saving, amount: Number(saving.amount) })
    );
    return savings;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest savings.");
  }
}

export const mapSaving = (saving: Data): Saving => {
  return {
    id: saving.id,
    date: new Date(saving.date || ""),
    description: saving.description || "",
    amount: saving.amount,
    formattedDate: format(new Date(saving.date || ""), "EEE dd"),
  };
};
