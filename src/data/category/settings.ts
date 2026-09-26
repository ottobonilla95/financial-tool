import { PrismaClient } from "@prisma/client";
import { MAX_CATEGORIES_FREE_PLAN } from "@/src/constants/categories";

const prisma = new PrismaClient();
export type CategoryKind = "expense" | "income";
export type ManagedCategory = { id: string; name: string; color: string | null; transactions: number; subcategories: number };

export async function fetchManagedCategories(userId: string) {
  if (!userId) throw new Error("Authentication required");
  const [expenses, income] = await Promise.all([
    prisma.expense_category.findMany({ where: { user_id: userId }, orderBy: { name: "asc" }, select: { id: true, name: true, color: true, _count: { select: { expenses: true, expense_subcategory: true } } } }),
    prisma.earning_category.findMany({ where: { user_id: userId }, orderBy: { name: "asc" }, select: { id: true, name: true, color: true, _count: { select: { earning: true, earning_subcategory: true } } } }),
  ]);
  return {
    expense: expenses.map(({ _count, ...category }) => ({ ...category, transactions: _count.expenses, subcategories: _count.expense_subcategory })),
    income: income.map(({ _count, ...category }) => ({ ...category, transactions: _count.earning, subcategories: _count.earning_subcategory })),
  };
}

export async function mutateManagedCategory(userId: string, kind: CategoryKind, operation: "create" | "update" | "delete", id?: string, values?: { name: string; color: string }) {
  if (!userId) throw new Error("Authentication required");
  return prisma.$transaction(async (tx) => {
    const where = { id, user_id: userId };
    if (operation === "create" && values) {
      if (kind === "expense") {
        const user = await tx.users.findUniqueOrThrow({ where: { id: userId }, select: { subscription_plan: true } });
        const count = await tx.expense_category.count({ where: { user_id: userId } });
        if (!user.subscription_plan && count >= MAX_CATEGORIES_FREE_PLAN) return "limit" as const;
        await tx.expense_category.create({ data: { ...values, user_id: userId } });
      } else {
        await tx.earning_category.create({ data: { ...values, user_id: userId } });
      }
    } else if (id && operation === "update" && values) {
      const result = kind === "expense"
        ? await tx.expense_category.updateMany({ where, data: values })
        : await tx.earning_category.updateMany({ where, data: values });
      if (!result.count) return "missing" as const;
    } else if (id && operation === "delete") {
      // The relation predicates and database foreign keys both protect existing records.
      const result = kind === "expense"
        ? await tx.expense_category.deleteMany({ where: { ...where, expenses: { none: {} }, expense_subcategory: { none: {} } } })
        : await tx.earning_category.deleteMany({ where: { ...where, earning: { none: {} }, earning_subcategory: { none: {} } } });
      if (!result.count) return "inUse" as const;
    } else {
      throw new Error("Invalid category mutation");
    }
    return "success" as const;
  });
}
