import { PrismaClient, Prisma } from "@prisma/client";
import { Expense } from "@/src/types";

const prisma = new PrismaClient();

export type Data = {
  id: string;
  amount: number;
  description: string | null;
  date: Date | null;
  expensecategory: {
    id: string;
    name: string;
    color: string | null;
  } | null;
  expensesubcategory: {
    id: string;
    name: string;
  } | null;
  satisfaction: number | null;
  emotion: {
    id: number;
    emotion_type: string;
    name: string;
    color: string | null;
  } | null;
};

type FetchExpensesProps = {
  filters?: Prisma.expensesWhereInput;
};

export async function fetchExpenses({ filters }: FetchExpensesProps) {
  try {
    const data = await prisma.expenses.findMany({
      select: {
        id: true,
        amount: true,
        date: true,
        description: true,
        expensecategory: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        expensesubcategory: {
          select: {
            id: true,
            name: true,
          },
        },
        satisfaction: true,
        emotion: {
          select: {
            id: true,
            emotion_type: true,
            name: true,
            color: true,
          },
        },
      },
      where: filters,
      orderBy: {
        date: "asc",
      },
    });

    const expenses = data.map((expense) =>
      mapExpense({ ...expense, amount: Number(expense.amount) })
    );
    return expenses;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest expenses.");
  }
}

export const mapExpense = (expense: Data): Expense => {
  const dateFromPrisma = new Date(expense.date?.toISOString() || "");
  const correctDate = new Date(
    dateFromPrisma.getUTCFullYear(),
    dateFromPrisma.getUTCMonth(),
    dateFromPrisma.getUTCDate()
  );

  return {
    id: expense.id,
    date: correctDate,
    description: expense.description || "",
    amount: expense.amount,
    category: {
      id: expense.expensecategory?.id || "",
      name: expense.expensecategory?.name || "",
      color: expense.expensecategory?.color || "",
    },
    subcategory: {
      id: expense.expensesubcategory?.id || "",
      name: expense.expensesubcategory?.name || "",
    },
    satisfaction: expense.satisfaction || 0,
    emotion: {
      id: expense.emotion?.id || 0,
      emotionType: expense.emotion?.emotion_type || "",
      name: expense.emotion?.name || "",
      color: expense.emotion?.color || "",
    },
    formattedDate: `${expense.date?.toUTCString().split(",")[0]} ${String(
      expense.date?.getUTCDate()
    ).padStart(2, "0")}`,
  };
};

// Combine them in the desired order
// Ensure expense.date is treated as UTC

// const ITEMS_PER_PAGE = 6;
// export async function fetchFilteredInvoices(
//   query: string,
//   currentPage: number
// ) {
//   const offset = (currentPage - 1) * ITEMS_PER_PAGE;

//   try {
//     const invoices = await sql<InvoicesTable>`
//       SELECT
//         invoices.id,
//         invoices.amount,
//         invoices.date,
//         invoices.status,
//         customers.name,
//         customers.email,
//         customers.image_url
//       FROM invoices
//       JOIN customers ON invoices.customer_id = customers.id
//       WHERE
//         customers.name ILIKE ${`%${query}%`} OR
//         customers.email ILIKE ${`%${query}%`} OR
//         invoices.amount::text ILIKE ${`%${query}%`} OR
//         invoices.date::text ILIKE ${`%${query}%`} OR
//         invoices.status ILIKE ${`%${query}%`}
//       ORDER BY invoices.date DESC
//       LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
//     `;

//     return invoices.rows;
//   } catch (error) {
//     console.error("Database Error:", error);
//     throw new Error("Failed to fetch invoices.");
//   }
// }

// export async function fetchInvoicesPages(query: string) {
//   try {
//     const count = await sql`SELECT COUNT(*)
//     FROM invoices
//     JOIN customers ON invoices.customer_id = customers.id
//     WHERE
//       customers.name ILIKE ${`%${query}%`} OR
//       customers.email ILIKE ${`%${query}%`} OR
//       invoices.amount::text ILIKE ${`%${query}%`} OR
//       invoices.date::text ILIKE ${`%${query}%`} OR
//       invoices.status ILIKE ${`%${query}%`}
//   `;

//     const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
//     return totalPages;
//   } catch (error) {
//     console.error("Database Error:", error);
//     throw new Error("Failed to fetch total number of invoices.");
//   }
// }

// export async function fetchInvoiceById(id: string) {
//   try {
//     const data = await sql<InvoiceForm>`
//       SELECT
//         invoices.id,
//         invoices.customer_id,
//         invoices.amount,
//         invoices.status
//       FROM invoices
//       WHERE invoices.id = ${id};
//     `;

//     const invoice = data.rows.map((invoice) => ({
//       ...invoice,
//       // Convert amount from cents to dollars
//       amount: invoice.amount / 100,
//     }));

//     return invoice[0];
//   } catch (error) {
//     console.error("Database Error:", error);
//     throw new Error("Failed to fetch invoice.");
//   }
// }
