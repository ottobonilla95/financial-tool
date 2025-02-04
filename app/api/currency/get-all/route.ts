import { getAllCurrencies } from "@/src/data/currency";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const currencies = await getAllCurrencies();
    return NextResponse.json(currencies);
  } catch (error) {
    console.error("Error fetching currencies:", error);
    return NextResponse.json(
      { error: "Failed to fetch currencies" },
      { status: 500 }
    );
  }
}
