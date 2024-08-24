import { fetchMonthExpenses } from "@/src/data/expenses";
import { auth } from "@/auth";
import {
  DashboardDatePicker,
  ExpensesPieChart,
  ExpensesWrapper,
  DashboardTotals,
  LastUpdated,
  DashboardButtons,
  NoExpensesAdded,
} from "@/src/ui/dashboard";

import { Suspense } from "react";
import { fetchMonthIncome } from "@/src/data/income";
import { getAllEmotions } from "@/src/data/emotion";

export type DashboardPageProps = {
  searchParams: {
    month: string;
    year: string;
  };
};
export default async function Page({ searchParams }: DashboardPageProps) {
  const session = await auth();
  const userId = session?.user?.id as string;

  const currentDate = new Date();

  const month = Number(searchParams.month) || currentDate.getMonth() + 1;
  const year = Number(searchParams.year) || currentDate.getFullYear();

  const expenses = await fetchMonthExpenses(userId, month, year);
  const earnings = await fetchMonthIncome(userId, month, year);
  const emotions = (await getAllEmotions()).sort((a, b) =>
    a.emotionType.localeCompare(b.emotionType)
  );

  return (
    <main>
      <Suspense fallback={<div>loading...</div>}>
        <LastUpdated />
      </Suspense>
      <div className="h-5" />

      <Suspense fallback={<div>loading...</div>}>
        <DashboardButtons emotions={emotions} />
      </Suspense>

      <DashboardTotals expenses={expenses} earnings={earnings} />

      <DashboardDatePicker />

      {expenses.length > 0 && (
        <>
          <div className="w-full">
            <ExpensesPieChart expenses={expenses} />
          </div>
          <div>
            <ExpensesWrapper expenses={expenses} />
          </div>
        </>
      )}
      {expenses.length === 0 && <NoExpensesAdded />}
    </main>
  );
}
