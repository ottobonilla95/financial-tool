import { PrismaClient } from "@prisma/client";
import { Emotion } from "@/src/types";

const prisma = new PrismaClient();

export type Data = {
  id: number;
  name: string;
  emotion_type: string;
};

export async function getAllEmotions() {
  try {
    const data = await prisma.emotion.findMany({
      select: {
        id: true,
        name: true,
        emotion_type: true,
      },
    });

    const emotions = data.map((emotion: Data) => mapEmotion({ ...emotion }));
    return emotions;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest expenses.");
  }
}

export const mapEmotion = (emotion: Data): Emotion => {
  return {
    id: emotion.id,
    name: emotion.name,
    emotionType: emotion.emotion_type,
  };
};
