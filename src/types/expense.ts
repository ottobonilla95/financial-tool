export type Expense = {
  amount: string;
  id: string;
  description: string;
  expenseDate: Date;
  category: {
    id: string;
    name: string;
    color: string;
  };
  subcategory: {
    id: string;
    name: string;
  };
};
