import { Expense, Earning, Saving } from "@/src/types";
import clsx from "clsx";
import { Price } from "../components";
import { AppDictionary } from "@/src/translations";

export type DashboardTotalsProps = {
  expenses: Expense[];
  earnings: Earning[];
  savings: Saving[];
  dict: AppDictionary;
};

export const DashboardTotals = ({
  expenses,
  earnings,
  savings,
  dict,
}: DashboardTotalsProps) => {
  const calculateTotal = (expenses: (Expense | Earning | Saving)[]) => {
    return expenses.reduce((acc, expense) => acc + expense.amount, 0);
  };

  if (expenses.length === 0) {
    return null;
  }

  const totalEarnings = calculateTotal(earnings);
  const totalExpenses = calculateTotal(expenses);
  const totalSavings = calculateTotal(savings);

  const totalBalance = totalEarnings - totalExpenses - totalSavings;

  return (
    <div className="flex flex-col sm:flex-row mb-5 gap-2">
      <div>
        <div className="bg-green-200 rounded flex">
          <div className="font-bold mr-4 bg-green-400 rounded px-2 py-1 flex-1">
            {dict.dashboard.totalIncome}
          </div>
          <div className="pr-2 py-1 flex-1 flex justify-end">
            <Price amount={totalEarnings} />
          </div>
        </div>
      </div>
      <div>
        <div className="bg-red-200 rounded flex">
          <div className="font-bold mr-4 bg-red-400 rounded px-2 py-1 flex-1">
            {dict.dashboard.totalExpenses}
          </div>
          <div className="pr-2 py-1 flex-1 flex justify-end">
            <Price amount={totalExpenses} />
          </div>
        </div>
      </div>
      <div>
        <div
          className={clsx("flex rounded", {
            "bg-red-200": totalBalance < 0,
            "bg-green-200": totalBalance >= 0,
          })}
        >
          <div
            className={clsx("font-bold mr-4 rounded px-2 py-1 flex-1", {
              "bg-red-400": totalBalance < 0,
              "bg-green-400": totalBalance >= 0,
            })}
          >
            {dict.dashboard.balance}
          </div>
          <div className="pr-2 py-1 flex-1 flex justify-end">
            <Price amount={totalBalance} />
          </div>
        </div>
      </div>

      <div>
        <div
          className={clsx("flex rounded", {
            "bg-red-200": totalSavings <= 0,
            "bg-green-200": totalSavings > 0,
          })}
        >
          <div
            className={clsx("font-bold mr-4 rounded px-2 py-1 flex-1", {
              "bg-red-400": totalSavings <= 0,
              "bg-green-400": totalSavings > 0,
            })}
          >
            {dict.shared.savings}
          </div>
          <div className="pr-2 py-1 flex-1 flex justify-end">
            <Price amount={totalSavings} />
          </div>
        </div>
      </div>
    </div>
  );
};
