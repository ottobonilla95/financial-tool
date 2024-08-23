import { auth } from "@/auth";
import { fetchExpensesCategories } from "@/src/data/expense-category";

export async function GET() {
  const session = await auth();

  const categories = await fetchExpensesCategories(session?.user?.id as string);

  return Response.json({ categories });
}
