import { Expense } from "../expense";
import { Income } from "../income";

export type ExpensesByCategory = {
  [categoryName: string]: {
    [subcategoryName: string]: Expense[];
  };
};

export type IncomeByCategory = {
  [categoryName: string]: {
    [subcategoryName: string]: Income[];
  };
};
