import { Expense } from "@/src/types";
import { ExpenseTable } from "./expense-table";

export type ExpensesWrapperProps = {
  expenses: Expense[];
};
export type ExpensesByCategory = {
  [categoryName: string]: {
    [subcategoryName: string]: Expense[];
  };
};
const splitByCategoryAndSubcategory = (expenses: Expense[]) => {
  return expenses.reduce((acc: ExpensesByCategory, expense) => {
    const { category, subcategory } = expense;
    if (!acc[category.name]) {
      acc[category.name] = {};
    }
    if (!acc[category.name][subcategory.name]) {
      acc[category.name][subcategory.name] = [];
    }
    acc[category.name][subcategory.name].push(expense);
    return acc;
  }, {});
};

export const ExpensesWrapper = ({ expenses }: ExpensesWrapperProps) => {
  const expensesByCategory = splitByCategoryAndSubcategory(expenses);

  return (
    <div className="gap-4 grid grid-cols-1 sm:grid-cols-3 grid-flow-dense">
      {Object.entries(expensesByCategory).map(
        ([categoryName, subcategories]) => (
          <ExpenseTable
            key={categoryName}
            categoryName={categoryName}
            subcategories={subcategories}
          />
        )
      )}
    </div>
  );
};
