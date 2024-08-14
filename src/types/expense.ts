import { Category } from "./category";

export type Expense = {
  amount: number;
  id: string;
  description: string;
  expenseDate: Date;
  category: Category;
  subcategory: {
    id: string;
    name: string;
  };
};
