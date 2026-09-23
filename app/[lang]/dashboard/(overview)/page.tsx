import { fetchExpenses } from "@/src/data/expenses";
import { auth } from "@/auth";
import {
  ExpensesPieChart,
  DashboardTotals,
  LastUpdated,
  DashboardButtons,
  NoExpensesAdded,
  SavingTableContainer,
  DashboardExpeneseByEmotion,
  DashboardExpeneseBySatisfaction,
  ExpensesByDayGraph,
  DailyExpensesComparisonChart,
  ExpenseTotalsPerCategory,
  ExpensesByDayTableContainer,
  DashboardProvider,
} from "@/src/ui/financial-app/dashboard";
import { Suspense } from "react";
import { fetchEarnings } from "@/src/data/earning";
import { getAllEmotions } from "@/src/data/emotion";
import { fetchSavings } from "@/src/data/saving";
import { getDBUser } from "@/src/data/user";
import { AppProvider } from "@/src/app-wrappper/provider";
import { Currency } from "@/src/types";
import { endOfMonth } from "date-fns";
import { getDictionary, AvailableLanguages } from "@/src/translations";
import { IntlProvider } from "@/src/translations/provider";
import { Spinner } from "@/src/ui/components";
import TourProvider from "@/src/ui/financial-app/tour/provider";
import TourInitiator from "@/src/ui/financial-app/tour/tour-initiator";
import { redirect } from "next/navigation";
import { CurrencyPicker } from "@/src/ui/financial-app/currency/currency-picker";
import { CategoryFilterContainer } from "@/src/ui/financial-app/dashboard/category-filter-container";
import { URLParamHandler } from "./url-param-handler";
import { filterRecordsThroughDay } from "@/src/helpers/filter-records-through-day";

export type DashboardPageProps = {
  searchParams: {
    month: string;
    year: string;
  };
  params: { lang: AvailableLanguages };
};

// Helper to get month range dates
function getMonthRange(year: number, month: number, dayOfMonth: number, isCurrentMonth: boolean) {
  const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
  const endDate = isCurrentMonth
    ? new Date(
        Date.UTC(
          year,
          month - 1,
          Math.min(dayOfMonth, endOfMonth(startDate).getDate()),
          23,
          59,
          59
        )
      )
    : new Date(Date.UTC(year, month, 0, 23, 59, 59));

  return { startDate, endDate };
}

// Helper to get previous month/year
function getPreviousMonth(year: number, month: number) {
  if (month === 1) {
    return { year: year - 1, month: 12 };
  }
  return { year, month: month - 1 };
}

export default async function Page({
  searchParams,
  params: { lang },
}: DashboardPageProps) {
  const currentDate = new Date();

  // Use month and year from searchParams if provided, otherwise use current month and year
  const selectedMonth =
    Number(searchParams.month) || currentDate.getMonth() + 1;

  const selectedYear = Number(searchParams.year) || currentDate.getFullYear();

  // Only get essential data on server side
  const dict = await getDictionary(lang);
  const session = await auth();
  const userId = session?.user?.id as string;

  const user = await getDBUser({
    filters: {
      id: userId,
    },
    select: {
      subscription_plan: true,
      email: true,
      stripeId: true,
      currency: {
        select: {
          id: true,
          name: true,
          symbol: true,
          currencyCode: true,
          countryCode: true,
        },
      },
      tour_finished: true,
    },
  });

  const currenciesData = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/currency/get-all`
  );
  const currencies = await currenciesData.json();

  const isPremium = user?.subscriptionPlan !== null;
  const stripeCustomerPortalLink = `${process.env.STRIPE_CUSTOMER_PORTAL_URL}?prefilled_email=${user?.email}`;
  const isUserOnStripe = Boolean(user?.stripeId);

  const currency = user?.currency;
  const tourFinished = user?.tourFinished;

  const dayOfMonth = currentDate.getDate();

  // Check if the selected month and year are the current month and year
  const isCurrentMonth =
    selectedMonth === currentDate.getMonth() + 1 &&
    selectedYear === currentDate.getFullYear();

  // Get date ranges for the selected month and the previous month.
  const month1 = { year: selectedYear, month: selectedMonth };
  const month2 = getPreviousMonth(month1.year, month1.month);

  const range1 = getMonthRange(month1.year, month1.month, dayOfMonth, isCurrentMonth);
  const range2 = getMonthRange(month2.year, month2.month, dayOfMonth, false);

  // Fetch both months of expenses, including the full previous month for the chart.
  const [expensesCurrent, expensesMonth2] = await Promise.all([
    fetchExpenses({
      filters: {
        user_id: userId,
        date: { gte: range1.startDate, lte: range1.endDate },
      },
    }),
    fetchExpenses({
      filters: {
        user_id: userId,
        date: { gte: range2.startDate, lte: range2.endDate },
      },
    }),
  ]);

  // Fetch both months of earnings for the dashboard totals.
  const [earningsCurrent, earningsMonth2] = await Promise.all([
    fetchEarnings({
      filters: {
        user_id: userId,
        date: { gte: range1.startDate, lte: range1.endDate },
      },
    }),
    fetchEarnings({
      filters: {
        user_id: userId,
        date: { gte: range2.startDate, lte: range2.endDate },
      },
    }),
  ]);

  // Fetch both months of savings for the dashboard totals.
  const [savingsCurrent, savingsMonth2] = await Promise.all([
    fetchSavings({
      filters: {
        user_id: userId,
        date: { gte: range1.startDate, lte: range1.endDate },
      },
    }),
    fetchSavings({
      filters: {
        user_id: userId,
        date: { gte: range2.startDate, lte: range2.endDate },
      },
    }),
  ]);

  // Cards labeled "same period last month" must use the same day cutoff.
  // If the previous month is shorter, all of its available days are included.
  const comparisonDayCount = range1.endDate.getUTCDate();
  const expensesPrevious = filterRecordsThroughDay(
    expensesMonth2,
    comparisonDayCount
  );
  const earningsPrevious = filterRecordsThroughDay(
    earningsMonth2,
    comparisonDayCount
  );
  const savingsPrevious = filterRecordsThroughDay(
    savingsMonth2,
    comparisonDayCount
  );

  const emotions = (await getAllEmotions()).sort((a, b) =>
    a.emotionType.localeCompare(b.emotionType)
  );

  if (!user?.subscriptionPlan) {
    redirect("/dashboard/pricing");
  }

  // Include previous-month categories so "select all" compares all spending.
  const allCategories = Array.from(
    new Map(
      [
        ...expensesCurrent.map((e) => e.category),
        ...expensesMonth2.map((e) => e.category),
        ...earningsCurrent.map((e) => e.category),
      ].map((category) => [category.id, category])
    ).values()
  );

  return (
    <AppProvider
      currency={currency as Currency}
      allCurrencies={currencies}
      subscriptionDetails={{
        isPremium,
        stripeCustomerPortalLink,
        isUserOnStripe,
      }}
    >
      <IntlProvider dict={dict} lang={lang}>
        <DashboardProvider
          emotions={emotions}
          month={selectedMonth}
          year={searchParams.year ? Number(searchParams.year) : undefined}
          categories={allCategories}
        >
          <TourProvider>
            <main>
              <URLParamHandler />

              {!tourFinished && <TourInitiator />}

              {tourFinished && user.currency === null && (
                <CurrencyPicker dict={dict} />
              )}

              <Suspense fallback={<div>loading...</div>}>
                <LastUpdated dict={dict} />
              </Suspense>
              <div className="h-5" />
              <div className="px-6 md:px-12 pb-12">
                <div className="tour-step-0">
                  <Suspense fallback={<Spinner className="w-5" />}>
                    <DashboardButtons dict={dict} />
                  </Suspense>
                </div>
                <DashboardTotals
                  expenses={expensesCurrent}
                  earnings={earningsCurrent}
                  earningsPrevious={earningsPrevious}
                  savings={savingsCurrent}
                  savingsPrevious={savingsPrevious}
                  dict={dict}
                  expensesPrevious={expensesPrevious}
                />

                {expensesCurrent.length > 0 && (
                  <div className="flex gap-4 flex-col lg:flex-row">
                    {isPremium && (
                      <div className="flex-1">
                        <DashboardExpeneseByEmotion
                          expenses={expensesCurrent}
                          dict={dict}
                        />
                        <DashboardExpeneseBySatisfaction
                          expenses={expensesCurrent}
                          dict={dict}
                        />
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="w-full ">
                        <ExpensesPieChart
                          expenses={expensesCurrent}
                          currency={currency as Currency}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {expensesCurrent.length > 0 && isPremium && (
                  <>
                    <div className="h-5" />
                    <ExpenseTotalsPerCategory
                      expenses={expensesCurrent}
                      expensesPrevious={expensesPrevious}
                      dict={dict}
                    />
                  </>
                )}

                {expensesCurrent.length > 0 && (
                  <CategoryFilterContainer
                    categories={allCategories}
                    dict={dict}
                  />
                )}
                {expensesCurrent.length > 0 && (
                  <div className="py-5">
                    <ExpensesByDayGraph
                      expenses={expensesCurrent}
                      dict={dict}
                    />
                    <div className="h-8" />
                    <DailyExpensesComparisonChart
                      key={`${selectedYear}-${selectedMonth}`}
                      currentExpenses={expensesCurrent}
                      previousExpenses={expensesMonth2}
                      selectedMonth={selectedMonth}
                      selectedYear={selectedYear}
                      comparisonDayCount={comparisonDayCount}
                      dict={dict}
                      lang={lang}
                    />
                  </div>
                )}

                {savingsCurrent.length > 0 && (
                  <div>
                    <SavingTableContainer
                      savings={savingsCurrent}
                      dict={dict}
                    />
                  </div>
                )}

                {expensesCurrent.length > 0 && (
                  <div>
                    <ExpensesByDayTableContainer
                      expenses={expensesCurrent}
                      earnings={earningsCurrent}
                      dict={dict}
                      isPremium={isPremium}
                    />
                  </div>
                )}

                {expensesCurrent.length === 0 &&
                  earningsCurrent.length === 0 && (
                    <NoExpensesAdded dict={dict} />
                  )}
              </div>
            </main>
          </TourProvider>
        </DashboardProvider>
      </IntlProvider>
    </AppProvider>
  );
}
