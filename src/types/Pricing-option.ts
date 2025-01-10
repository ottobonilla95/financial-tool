export type PricingOption = {
  id?: string;
  title: string;
  price: number;
  mostPopular: boolean;
  paymentLink: string;
  period: string;
  pricingGroup: string;
  isDiscount: boolean;
  originalPrice: number;
  createdAt: string;
};

export type PricingOptionGroup = "pricing1" | "pricing2" | "pricing3";
