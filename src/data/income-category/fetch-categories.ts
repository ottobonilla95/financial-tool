import { PrismaClient } from "@prisma/client";
import { EarningCategory } from "@/src/types";

const prisma = new PrismaClient();

export type Data = {
  id: string;
  name: string;
  color: string | null;
  earning_subcategory: {
    id: string;
    name: string;
  }[];
};

export async function fetchIncomeCategories(userId: string) {
  try {
    const data = await prisma.earning_category.findMany({
      select: {
        id: true,
        name: true,
        earning_subcategory: {
          select: {
            id: true,
            name: true,
          },
        },
        color: true,
      },
      where: {
        user_id: userId,
      },
    });

    const categories = data.map((category: Data) =>
      mapCategory({ ...category })
    );
    return categories;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest expenses.");
  }
}

export const mapCategory = (expense: Data): EarningCategory => {
  return {
    id: expense.id,
    name: expense.name,
    subcategories: expense.earning_subcategory.map((subcategory) => ({
      id: subcategory.id,
      name: subcategory.name,
    })),
    color: expense.color || "",
  };
};
