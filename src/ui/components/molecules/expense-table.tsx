import { darkenHexColor } from "@/src/helpers/modify-color";
import { Expense } from "@/src/types";
import clsx from "clsx";
import { format } from "date-fns";

export type ExpenseTableProps = {
  categoryName: string;
  subcategories: {
    [subcategoryName: string]: Expense[];
  };
};

const calculateSubcategoryTotal = (expenses: Expense[]) => {
  return expenses.reduce((acc, expense) => acc + expense.amount, 0);
};
const calculateTotal = (subcategories: {
  [subcategoryName: string]: Expense[];
}) => {
  return Object.values(subcategories).reduce(
    (acc, expenses) => acc + calculateSubcategoryTotal(expenses),
    0
  );
};

export const ExpenseTable = ({
  categoryName,
  subcategories,
}: ExpenseTableProps) => {
  const getCategoryColor = (subcategories: {
    [subcategoryName: string]: Expense[];
  }): string => {
    for (const expenseArray of Object.values(subcategories)) {
      const expense = expenseArray[0];

      return expense.category.color;
    }

    return "#FFFFFF";
  };
  const color = getCategoryColor(subcategories);
  return (
    <div
      style={{
        backgroundColor: color,
      }}
      className="rounded"
    >
      <h2 className="font-bold text-lg mb-2 uppercase py-2 px-4">
        {categoryName}
      </h2>
      {Object.entries(subcategories).map(
        ([subcategoryName, expenseArray], index) => (
          <div
            key={subcategoryName}
            className={clsx("mb-2", {
              "mb-0": index === Object.entries(subcategories).length - 1,
            })}
          >
            <h3 className="font-bold text-base  py-2 px-4">
              {subcategoryName}
            </h3>
            {expenseArray.map((expense) => (
              <div key={expense.id} className="grid grid-cols-4 py-2 px-4">
                <div className="font-medium">{expense.description}</div>
                <div className="col-span-2 text-center">
                  {format(expense.date, "EEE dd")}
                </div>
                <div className="flex justify-end"> {expense.amount}</div>
              </div>
            ))}
            <div
              className="flex justify-between py-2 px-4"
              style={{
                backgroundColor: darkenHexColor(color, 0.07),
              }}
            >
              <div className="font-bold">Total</div>
              <div className="font-bold">
                {calculateSubcategoryTotal(expenseArray).toFixed(2)}
              </div>
            </div>
          </div>
        )
      )}
      <div
        className="flex justify-between py-2 px-4 rounded"
        style={{
          backgroundColor: darkenHexColor(color, 0.15),
        }}
      >
        <div className="font-bold">Total</div>
        <div className="font-bold">
          {calculateTotal(subcategories).toFixed(2)}
        </div>
      </div>
    </div>
  );
};
