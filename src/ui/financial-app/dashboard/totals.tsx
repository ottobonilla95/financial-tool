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
  expensesPrevious: Expense[];
  earnings: Earning[];
  earningsPrevious: Earning[];
  savings: Saving[];
  savingsPrevious: Saving[];
  dict: AppDictionary;
};

export const DashboardTotals = ({
  expenses,
  expensesPrevious,
  earnings,
  earningsPrevious,
  savings,
  savingsPrevious,
  dict,
}: DashboardTotalsProps) => {
  const calculateTotal = (expenses: (Expense | Earning | Saving)[]) => {
    return expenses.reduce((acc, expense) => acc + expense.amount, 0);
  };

  if (expenses.length === 0 && earnings.length === 0 && savings.length === 0) {
    return null;
  }

  const totalExpenses = calculateTotal(expenses);
  const totalExpensesPrevious = calculateTotal(expensesPrevious);
  const totalEarnings = calculateTotal(earnings);
  const totalEarningsPrevious = calculateTotal(earningsPrevious);
  const totalSavings = calculateTotal(savings);
  const totalSavingsPrevious = calculateTotal(savingsPrevious);
  const totalBalance = totalEarnings - totalExpenses - totalSavings;
  const totalBalancePrevious =
    totalEarningsPrevious - totalExpensesPrevious - totalSavingsPrevious;

  return (
    <div className="flex flex-col md:flex-row mb-5 gap-2 md:flex-wrap">
      <DashboardTotalBox
        icon={<BanknotesIcon className="w-5" />}
        label={dict.dashboard.totalIncome}
        value={totalEarnings}
        iconClassName="!bg-lime-100"
        previousMonthValue={totalEarningsPrevious}
      />
      <DashboardTotalBox
        icon={<FireIcon className="w-5" />}
        label={dict.dashboard.totalExpenses}
        value={totalExpenses}
        previousMonthValue={totalExpensesPrevious}
        iconClassName="!bg-red-100"
        negativeIncrease
      />
      <DashboardTotalBox
        icon={<ScaleIcon className="w-5" />}
        label={dict.dashboard.balance}
        value={totalBalance}
        iconClassName={clsx({
          "!bg-red-100": totalBalance < 0,
          "!bg-lime-100": totalBalance >= 0,
        })}
        previousMonthValue={totalBalancePrevious}
      />
      <DashboardTotalBox
        icon={<WalletIcon className="w-5" />}
        label={dict.shared.savings}
        value={totalSavings}
        iconClassName={clsx({
          "!bg-lime-100": totalSavings > 0,
        })}
        previousMonthValue={totalSavingsPrevious}
      />
    </div>
  );
};
