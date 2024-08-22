import { auth } from "@/auth";
import { fetchIncomeCategories } from "@/src/data/income-category";

export async function GET() {
  const session = await auth();

  const categories = await fetchIncomeCategories(session?.user?.id as string);

  return Response.json({ categories });
}
