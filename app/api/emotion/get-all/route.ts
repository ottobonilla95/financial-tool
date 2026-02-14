import { getAllEmotions } from "@/src/data/emotion";

export const dynamic = "force-dynamic";

export async function GET() {
  const emotions = await getAllEmotions();

  return Response.json({ emotions });
}
