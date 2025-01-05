import { ExpenseCategory } from "./category";
import { Emotion } from "./emotion";

export type Expense = {
  amount: number;
  id: string;
  description: string;
  date: Date;
  category: ExpenseCategory;
  subcategory: {
    id: string;
    name: string;
  };
  satisfaction: number;
  emotion: Partial<Emotion>;
  formattedDate?: string;
};
