import { PricingOption } from "@/src/types";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export type Data = {
  id: string;
  title: string | null;
  price: number | null;
  most_popular: boolean | null;
  paymentLink: string | null;
  period: string | null;
  pricing_group: string | null;
  is_discount: boolean | null;
  original_price: number | null;
  created_at: Date | null;
};

type GetUserDataProps = {
  filters?: Prisma.pricing_optionWhereInput;
  select?: Prisma.pricing_optionSelect;
};

export async function getPricingOptions({ filters, select }: GetUserDataProps) {
  try {
    const options = await prisma.pricing_option.findMany({
      where: filters,
      select: select,
    });

    return options.map(mapOption);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to get user.");
  }
}

export const mapOption = (pricingOption: Data): PricingOption => {
  return {
    id: pricingOption.id,
    title: pricingOption.title || "",
    price: pricingOption.price || 0,
    mostPopular: pricingOption.most_popular || false,
    paymentLink: pricingOption.paymentLink || "",
    period: pricingOption.period || "",
    pricingGroup: pricingOption.pricing_group || "",
    isDiscount: pricingOption.is_discount || false,
    originalPrice: pricingOption.original_price || 0,
    createdAt: pricingOption.created_at?.toISOString() || "",
  };
};
