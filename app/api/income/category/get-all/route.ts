import { auth } from "@/auth";
import { fetchIncomeCategories } from "@/src/data/income-category";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categories = await fetchIncomeCategories(userId);

    return Response.json({ categories });
  } catch (error) {
    console.error("Failed to fetch income categories:", error);
    return Response.json(
      { error: "Failed to fetch income categories" },
      { status: 500 }
    );
  }
}
