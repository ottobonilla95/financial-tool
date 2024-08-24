import { getAllEmotions } from "@/src/data/emotion";

export async function GET() {
  const emotions = await getAllEmotions();

  return Response.json({ emotions });
}
