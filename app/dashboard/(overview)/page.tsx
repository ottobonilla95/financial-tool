import { fetchExpenses } from "@/src/data/expenses";
import { auth } from "@/auth";
import {
  DashboardDatePicker,
  ExpensesPieChart,
  ExpensesTableContainer,
  DashboardTotals,
  LastUpdated,
  DashboardButtons,
  NoExpensesAdded,
  IncomeTableContainer,
  SavingTableContainer,
} from "@/src/ui/dashboard";

import { Suspense } from "react";
import { fetchEarnings } from "@/src/data/earning";
import { getAllEmotions } from "@/src/data/emotion";
import { fetchSavings } from "@/src/data/saving";
import { getDBUser } from "@/src/data/user";
import { AppProvider } from "@/src/app-wrappper/provider";
import { Currency } from "@/src/types";
import { endOfMonth, startOfMonth } from "date-fns";

export type DashboardPageProps = {
  searchParams: {
    month: string;
    year: string;
  };
};
export default async function Page({ searchParams }: DashboardPageProps) {
  const session = await auth();
  const userId = session?.user?.id as string;

  const currency = (
    await getDBUser({
      filters: {
        id: userId,
      },
      select: {
        currency: {
          select: {
            name: true,
            symbol: true,
          },
        },
      },
    })
  )?.currency;

  const currentDate = new Date();

  const month = Number(searchParams.month) || currentDate.getMonth() + 1;
  const year = Number(searchParams.year) || currentDate.getFullYear();

  const startDate = startOfMonth(new Date(year, month - 1));
  const endDate = endOfMonth(new Date(year, month - 1));

  const expenses = await fetchExpenses({
    filters: {
      user_id: userId,
      date: {
        gte: startDate.toISOString(),
        lte: endDate.toISOString(),
      },
    },
  });
  const earnings = await fetchEarnings({
    filters: {
      user_id: userId,
      date: {
        gte: startDate.toISOString(),
        lte: endDate.toISOString(),
      },
    },
  });
  const savings = await fetchSavings({
    filters: {
      user_id: userId,
      date: {
        gte: startDate.toISOString(),
        lte: endDate.toISOString(),
      },
    },
  });

  const emotions = (await getAllEmotions()).sort((a, b) =>
    a.emotionType.localeCompare(b.emotionType)
  );

  return (
    <AppProvider currency={currency as Currency}>
      <main>
        <Suspense fallback={<div>loading...</div>}>
          <LastUpdated />
        </Suspense>
        <div className="h-5" />

        <Suspense fallback={<div>loading...</div>}>
          <DashboardButtons emotions={emotions} />
        </Suspense>

        <DashboardTotals
          expenses={expenses}
          earnings={earnings}
          savings={savings}
        />

        <DashboardDatePicker />
        {expenses.length > 0 && (
          <div className="w-full ">
            <ExpensesPieChart expenses={expenses} />
          </div>
        )}
        {savings.length > 0 && (
          <div>
            <SavingTableContainer savings={savings} />
          </div>
        )}
        {earnings.length > 0 && (
          <div>
            <IncomeTableContainer earnings={earnings} />
          </div>
        )}
        {expenses.length > 0 && (
          <div>
            <ExpensesTableContainer expenses={expenses} />
          </div>
        )}

        {expenses.length === 0 && earnings.length === 0 && <NoExpensesAdded />}
      </main>
    </AppProvider>
  );
}
