import { auth } from "@/auth";
import { fetchCategories } from "@/src/data/categories";

export async function GET() {
  const session = await auth();

  const categories = await fetchCategories(session?.user?.id as string);

  return Response.json({ categories });
}
