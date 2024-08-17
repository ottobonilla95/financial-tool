import { PrismaClient } from "@prisma/client";
import { Category } from "@/src/types";

const prisma = new PrismaClient();

export type Data = {
  id: string;
  name: string;
  color: string | null;
  expense_subcategory: {
    id: string;
    name: string;
  }[];
};

export async function fetchCategories(userId: string) {
  try {
    const data = await prisma.expense_category.findMany({
      select: {
        id: true,
        name: true,
        expense_subcategory: {
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

export const mapCategory = (expense: Data): Category => {
  return {
    id: expense.id,
    name: expense.name,
    subcategories: expense.expense_subcategory.map((subcategory) => ({
      id: subcategory.id,
      name: subcategory.name,
    })),
    color: expense.color || "",
  };
};
