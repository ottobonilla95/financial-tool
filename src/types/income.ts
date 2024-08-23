import { ExpenseCategory } from "./category";

export type Income = {
  amount: number;
  id: string;
  description: string;
  incomeDate: Date;
  category: ExpenseCategory;
  subcategory: {
    id: string;
    name: string;
  };
};
