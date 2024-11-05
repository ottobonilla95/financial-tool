import { EarningCategory } from "./category";

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
};
