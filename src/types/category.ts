export type ExpenseCategory = {
  id: string;
  name: string;
  color: string;
  subcategories?: {
    id: string;
    name: string;
  }[];
};

export type EarningCategory = {
  id: string;
  name: string;
  color: string;
  subcategories?: {
    id: string;
    name: string;
  }[];
};
