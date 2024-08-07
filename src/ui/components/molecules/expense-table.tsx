import { Expense } from "@/src/types";
import clsx from "clsx";

export type ExpenseTableProps = {
  categoryName: string;
  subcategories: {
    [subcategoryName: string]: Expense[];
  };
};

export type ExpensesByCategory = {
  [categoryName: string]: {
    [subcategoryName: string]: Expense[];
  };
};

const getCategoryColor = (subcategories: {
  [subcategoryName: string]: Expense[];
}): string => {
  for (const expenseArray of Object.values(subcategories)) {
    const expense = expenseArray[0];

    return expense.category.color;
  }

  return "#FFFFFF";
};

export const ExpenseTable = ({
  categoryName,
  subcategories,
}: ExpenseTableProps) => {
  return (
    <div
      style={{
        backgroundColor: getCategoryColor(subcategories),
      }}
      className="w-[420px] bg-red-50 rounded py-2 px-4"
    >
      <h2 className="font-bold text-lg mb-2">{categoryName}</h2>
      {Object.entries(subcategories).map(
        ([subcategoryName, expenseArray], index) => (
          <div
            key={subcategoryName}
            className={clsx("mb-5", {
              "mb-0": index === Object.entries(subcategories).length - 1,
            })}
          >
            <h3 className="font-bold text-base">{subcategoryName}</h3>
            {expenseArray.map((expense) => (
              <div key={expense.id} className="grid grid-cols-4">
                <div className="font-medium">{expense.description}</div>
                <div className="col-span-2 text-center">
                  {expense.createdAt.toDateString()}
                </div>
                <div className="flex justify-end"> {expense.amount}</div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};
