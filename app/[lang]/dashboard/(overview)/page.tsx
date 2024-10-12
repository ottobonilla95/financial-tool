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
  DashboardExpeneseByEmotion,
  DashboardExpeneseBySatisfaction,
} from "@/src/ui/dashboard";
import { Suspense } from "react";
import { fetchEarnings } from "@/src/data/earning";
import { getAllEmotions } from "@/src/data/emotion";
import { fetchSavings } from "@/src/data/saving";
import { getDBUser } from "@/src/data/user";
import { AppProvider } from "@/src/app-wrappper/provider";
import { Currency } from "@/src/types";
import { endOfMonth, startOfMonth } from "date-fns";
import { getDictionary, AvailableLanguages } from "@/src/translations";
import { IntlProvider } from "@/src/translations/provider";
import { Spinner } from "@/src/ui/components";
import TourProvider from "@/src/ui/tour/provider";
import TourInitiator from "@/src/ui/tour/tour-initiator";

export type DashboardPageProps = {
  searchParams: {
    month: string;
    year: string;
  };
  params: { lang: AvailableLanguages };
};

export default async function Page({
  searchParams,
  params: { lang },
}: DashboardPageProps) {
  const dict = await getDictionary(lang);

  const session = await auth();
  const userId = session?.user?.id as string;

  const user = await getDBUser({
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
      tour_finished: true,
    },
  });

  const currency = user?.currency;
  const tourFinished = user?.tourFinished;

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
      <IntlProvider dict={dict} lang={lang}>
        <TourProvider>
          <main>
            {!tourFinished && <TourInitiator />}
            <Suspense fallback={<div>loading...</div>}>
              <LastUpdated dict={dict} />
            </Suspense>
            <div className="h-5" />
            <div className="px-6 md:px-12">
              <div className="tour-step-0">
                <Suspense fallback={<Spinner className="w-5" />}>
                  <DashboardButtons
                    emotions={emotions}
                    month={month}
                    dict={dict}
                  />
                </Suspense>
              </div>

              <DashboardTotals
                expenses={expenses}
                earnings={earnings}
                savings={savings}
                dict={dict}
              />

              <div className="flex gap-4 flex-col lg:flex-row">
                <div className="flex-1">
                  <DashboardExpeneseByEmotion expenses={expenses} dict={dict} />
                  <DashboardExpeneseBySatisfaction
                    expenses={expenses}
                    dict={dict}
                  />
                </div>
                <div className="flex-1">
                  {expenses.length > 0 && (
                    <div className="w-full ">
                      <ExpensesPieChart expenses={expenses} />
                    </div>
                  )}
                </div>
              </div>

              {savings.length > 0 && (
                <div>
                  <SavingTableContainer savings={savings} dict={dict} />
                </div>
              )}
              {earnings.length > 0 && (
                <div>
                  <IncomeTableContainer earnings={earnings} dict={dict} />
                </div>
              )}
              {expenses.length > 0 && (
                <div>
                  <ExpensesTableContainer expenses={expenses} dict={dict} />
                </div>
              )}

              {expenses.length === 0 && earnings.length === 0 && (
                <NoExpensesAdded dict={dict} />
              )}
            </div>
          </main>
        </TourProvider>
      </IntlProvider>
    </AppProvider>
  );
}
