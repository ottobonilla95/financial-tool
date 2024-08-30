import { PrismaClient } from "@prisma/client";
import { Currency } from "@/src/types";

const prisma = new PrismaClient();

export type Data = {
  symbol: string;
  id: number;
  name: string;
  currencyCode: string | null;
  countryCode: string | null;
};

export async function getAllCurrencies() {
  try {
    const data = await prisma.currency.findMany({
      select: {
        id: true,
        name: true,
        symbol: true,
        currencyCode: true,
        countryCode: true,
      },
    });

    const currencies = data.map((currency) => mapCurrency(currency));
    return currencies;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the currencies.");
  }
}

export const mapCurrency = (currency: Data): Currency => {
  return {
    id: currency.id,
    name: currency.name,
    symbol: currency.symbol,
    currencyCode: currency.currencyCode || "",
    countryCode: currency.countryCode || "",
  };
};
