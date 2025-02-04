import { updateDBUser } from "@/src/data/user";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id as string;
  try {
    const { currencyId } = await req.json();

    if (!currencyId) {
      return NextResponse.json(
        { error: "Missing userId or currencyId" },
        { status: 400 }
      );
    }

    await updateDBUser({
      filters: {
        id: userId,
      },
      data: {
        currency_id: Number(currencyId),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user currency:", error);
    return NextResponse.json(
      { error: "Failed to update currency" },
      { status: 500 }
    );
  }
}
