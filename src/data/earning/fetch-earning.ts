import { PrismaClient, Prisma } from "@prisma/client";
import { Earning } from "@/src/types";

const prisma = new PrismaClient();

export type Data = {
  id: string;
  amount: number;
  description: string | null;
  date: Date | null;
  earning_category: {
    id: string;
    name: string;
    color: string | null;
  } | null;
  earning_subcategory: {
    id: string;
    name: string;
  } | null;
};

type FetchEarningProps = {
  filters?: Prisma.earningWhereInput;
};

export async function fetchEarnings({ filters }: FetchEarningProps) {
  try {
    const data = await prisma.earning.findMany({
      select: {
        id: true,
        amount: true,
        date: true,
        description: true,
        earning_category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        earning_subcategory: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: filters,
      orderBy: {
        date: "asc",
      },
    });

    const earnings = data.map((earning) =>
      mapEarning({ ...earning, amount: Number(earning.amount) })
    );
    return earnings;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest earnings.");
  }
}

export const mapEarning = (earning: Data): Earning => {
  const dateFromPrisma = new Date(earning.date?.toISOString() || "");
  const correctDate = new Date(
    dateFromPrisma.getUTCFullYear(),
    dateFromPrisma.getUTCMonth(),
    dateFromPrisma.getUTCDate()
  );

  return {
    id: earning.id,
    date: correctDate,
    description: earning.description || "",
    amount: earning.amount,
    category: {
      id: earning.earning_category?.id || "",
      name: earning.earning_category?.name || "",
      color: earning.earning_category?.color || "",
    },
    subcategory: {
      id: earning.earning_subcategory?.id || "",
      name: earning.earning_subcategory?.name || "",
    },
    formattedDate: `${earning.date?.toUTCString().split(",")[0]} ${String(
      earning.date?.getUTCDate()
    ).padStart(2, "0")}`,
  };
};
