import { NextRequest, NextResponse } from "next/server";

// API key for exchangerate-api
const API_KEY = "0f5bdf59bb46f3e8d5a03c47";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return NextResponse.json(
      { error: "Missing from or to currency code" },
      { status: 400 }
    );
  }

  try {
    // If same currency, rate is 1
    if (from === to) {
      return NextResponse.json({ rate: 1 });
    }

    // Fetch the latest rates with the 'from' currency as base
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${from}`
    );

    if (!response.ok) {
      throw new Error(`Exchange rate API returned ${response.status}`);
    }

    const data = await response.json();

    // Check if the API call was successful
    if (data.result !== "success") {
      throw new Error(
        `Exchange rate API error: ${data.error || "Unknown error"}`
      );
    }

    // Get the conversion rate for the target currency
    const rate = data.conversion_rates[to];

    if (rate === undefined) {
      throw new Error(`No conversion rate found for ${to}`);
    }

    return NextResponse.json({ rate });
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return NextResponse.json(
      { error: "Failed to fetch exchange rate" },
      { status: 500 }
    );
  }
}
