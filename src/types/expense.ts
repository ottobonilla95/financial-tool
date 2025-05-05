import { ExpenseCategory } from "./category";
import { Currency } from "./currency";
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
  createdAt: Date;
  originalAmount: number;
  exchangeRate: number;
  currency?: Currency;
};
