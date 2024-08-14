import { fetchMonthExpenses } from "@/src/data/expenses";
import { auth } from "@/auth";
import {
  DashboardDatePicker,
  ExpensesPieChart,
  ExpensesWrapper,
  DashboardTotals,
  LastUpdated,
  DashboardButtons,
} from "@/src/ui/dashboard";

import { Suspense } from "react";
import { Spinner } from "@/src/ui/components";

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

  return (
    <main>
      sdf
      {/* <Suspense fallback={<div>loading...</div>}>
        <LastUpdated />
      </Suspense>
      <div className="h-5" />

      <Suspense fallback={<div>loading...</div>}>
        <DashboardButtons />
      </Suspense>

      <DashboardTotals expenses={expenses} />
      <DashboardDatePicker />
      <div className="w-full">
        <ExpensesPieChart expenses={expenses} />
      </div> */}
      <div>
        {/* <ExpensesWrapper expenses={expenses} /> */}
      </div>
    </main>
  );
}
