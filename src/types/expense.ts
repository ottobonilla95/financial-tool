import { ExpenseCategory } from "./category";

export type Expense = {
  amount: number;
  id: string;
  description: string;
  expenseDate: Date;
  category: ExpenseCategory;
  subcategory: {
    id: string;
    name: string;
  };
};
