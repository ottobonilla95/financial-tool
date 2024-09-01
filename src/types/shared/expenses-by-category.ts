import { Expense } from "../expense";
import { Earning } from "../earning";

export type ExpensesByCategory = {
  [categoryName: string]: {
    [subcategoryName: string]: Expense[];
  };
};

export type EarningByCategory = {
  [categoryName: string]: {
    [subcategoryName: string]: Earning[];
  };
};
