import { EarningCategory } from "./category";
import { Currency } from "./currency";

export type Earning = {
  amount: number;
  id: string;
  description: string;
  date: Date;
  category: EarningCategory;
  subcategory: {
    id: string;
    name: string;
  };
  formattedDate?: string;
  createdAt: Date;
  originalAmount?: number;
  exchangeRate?: number;
  currency?: Currency;
};
