import { Expense, ExpensesByCategory } from "@/src/types";
import { ExpenseTable } from "./expense-table";
import { AppDictionary } from "@/src/translations";

export type ExpensesTableContainerProps = {
  expenses: Expense[];
  dict: AppDictionary;
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

export const ExpensesTableContainer = ({
  expenses,
  dict,
}: ExpensesTableContainerProps) => {
  const expensesByCategory = splitByCategoryAndSubcategory(expenses);

  return (
    <div className="mt-10">
      <div className="font-bold text-lg mb-5">{dict.dashboard.expense}</div>
      <div className="gap-4 grid grid-cols-1 lg:grid-cols-2 grid-flow-dense">
        {Object.entries(expensesByCategory).map(
          ([categoryName, subcategories]) => (
            <ExpenseTable
              key={categoryName}
              categoryName={categoryName}
              subcategories={subcategories}
              dict={dict}
            />
          )
        )}
      </div>
    </div>
  );
};
