import { Expense } from "@/src/types";

export type DashboardTotalsProps = {
  expenses: Expense[];
};

export const DashboardTotals = ({ expenses }: DashboardTotalsProps) => {
  const calculateTotal = (expenses: Expense[]) => {
    return expenses.reduce((acc, expense) => acc + expense.amount, 0);
  };
  return (
    <div className="flex">
      <div className="flex bg-red-200 rounded">
        <div className="font-bold mr-4 bg-red-400 rounded px-2 py-1">
          Total gastos
        </div>
        <div className="pr-2 py-1">{calculateTotal(expenses).toFixed(2)}</div>
      </div>
    </div>
  );
};
