import { Expense, Earning, Saving } from "@/src/types";
import clsx from "clsx";
import { AppDictionary } from "@/src/translations";
import { DashboardTotalBox } from "./total-box";
import {
  WalletIcon,
  ScaleIcon,
  BanknotesIcon,
  FireIcon,
} from "@heroicons/react/24/outline";

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
    <div className="flex flex-col md:flex-row mb-5 gap-2 md:flex-wrap">
      <DashboardTotalBox
        icon={<BanknotesIcon className="w-5" />}
        label={dict.dashboard.totalIncome}
        value={totalEarnings}
        iconClassName="bg-green-100"
      />
      <DashboardTotalBox
        icon={<FireIcon className="w-5" />}
        label={dict.dashboard.totalExpenses}
        value={totalExpenses}
        iconClassName="bg-red-100"
      />
      <DashboardTotalBox
        icon={<ScaleIcon className="w-5" />}
        label={dict.dashboard.balance}
        value={totalBalance}
        iconClassName={clsx({
          "bg-red-100": totalBalance < 0,
          "bg-green-100": totalBalance >= 0,
        })}
      />
      <DashboardTotalBox
        icon={<WalletIcon className="w-5" />}
        label={dict.shared.savings}
        value={totalSavings}
        iconClassName={clsx({
          "bg-green-100": totalSavings > 0,
        })}
      />
    </div>
  );
};
