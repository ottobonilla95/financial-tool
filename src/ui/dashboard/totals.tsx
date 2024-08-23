import { Expense, Income } from "@/src/types";
import clsx from "clsx";

export type DashboardTotalsProps = {
  expenses: Expense[];
  earnings: Income[];
};

export const DashboardTotals = ({
  expenses,
  earnings,
}: DashboardTotalsProps) => {
  const calculateTotal = (expenses: (Expense | Income)[]) => {
    return expenses.reduce((acc, expense) => acc + expense.amount, 0);
  };

  if (expenses.length === 0) {
    return null;
  }

  const totalEarnings = calculateTotal(earnings);
  const totalExpenses = calculateTotal(expenses);
  const totalBalance = totalEarnings - totalExpenses;

  return (
    <div className="flex mb-5 gap-2">
      <div className="flex bg-green-200 rounded">
        <div className="font-bold mr-4 bg-green-400 rounded px-2 py-1">
          Total Ingresos
        </div>
        <div className="pr-2 py-1">{totalEarnings.toFixed(2)}</div>
      </div>
      <div className="flex bg-red-200 rounded">
        <div className="font-bold mr-4 bg-red-400 rounded px-2 py-1">
          Total gastos
        </div>
        <div className="pr-2 py-1">{totalExpenses.toFixed(2)}</div>
      </div>
      <div
        className={clsx("flex rounded", {
          "bg-red-200": totalBalance < 0,
          "bg-green-200": totalBalance >= 0,
        })}
      >
        <div
          className={clsx("font-bold mr-4 rounded px-2 py-1", {
            "bg-red-400": totalBalance < 0,
            "bg-green-400": totalBalance >= 0,
          })}
        >
          Balance
        </div>
        <div className="pr-2 py-1">{totalBalance.toFixed(2)}</div>
      </div>
    </div>
  );
};
