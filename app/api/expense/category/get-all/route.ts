import { auth } from "@/auth";
import { fetchExpensesCategories } from "@/src/data/expense-category";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categories = await fetchExpensesCategories(userId);

    return Response.json({ categories });
  } catch (error) {
    console.error("Failed to fetch expense categories:", error);
    return Response.json(
      { error: "Failed to fetch expense categories" },
      { status: 500 }
    );
  }
}
