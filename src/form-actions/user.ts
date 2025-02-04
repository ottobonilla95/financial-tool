"use server";

import { auth } from "@/auth";
import { updateDBUser } from "../data/user";
import { revalidatePath } from "next/cache";

export async function setTourFinished() {
  const session = await auth();
  const userId = session?.user?.id as string;

  try {
    await updateDBUser({
      filters: {
        id: userId,
      },
      data: {
        tour_finished: true,
      },
    });
  } catch (error) {
    return "error";
  }
  revalidatePath("/dashboard");

  return "success";
}
