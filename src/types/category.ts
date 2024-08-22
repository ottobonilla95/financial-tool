export type ExpenseCategory = {
  id: string;
  name: string;
  color: string;
  subcategories?: {
    id: string;
    name: string;
  }[];
};

export type IncomeCategory = {
  id: string;
  name: string;
  color: string;
  subcategories?: {
    id: string;
    name: string;
  }[];
};
