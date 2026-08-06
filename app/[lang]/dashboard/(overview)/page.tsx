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
  FinancialAdvisor,
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
      name: true,
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
      goal_amount: true,
      goal_timeframe: true,
      goal_description: true,
      last_advice_date: true,
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

  // Get date ranges for current month and 3 previous months (4 total)
  const month1 = { year: selectedYear, month: selectedMonth };
  const month2 = getPreviousMonth(month1.year, month1.month);
  const month3 = getPreviousMonth(month2.year, month2.month);
  const month4 = getPreviousMonth(month3.year, month3.month);

  const range1 = getMonthRange(month1.year, month1.month, dayOfMonth, isCurrentMonth);
  const range2 = getMonthRange(month2.year, month2.month, dayOfMonth, false);
  const range3 = getMonthRange(month3.year, month3.month, dayOfMonth, false);
  const range4 = getMonthRange(month4.year, month4.month, dayOfMonth, false);

  // Fetch expenses for all 4 months in parallel
  const [expensesCurrent, expensesMonth2, expensesMonth3, expensesMonth4] = await Promise.all([
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
    fetchExpenses({
      filters: {
        user_id: userId,
        date: { gte: range3.startDate, lte: range3.endDate },
      },
    }),
    fetchExpenses({
      filters: {
        user_id: userId,
        date: { gte: range4.startDate, lte: range4.endDate },
      },
    }),
  ]);

  // Fetch earnings for all 4 months in parallel
  const [earningsCurrent, earningsMonth2, earningsMonth3, earningsMonth4] = await Promise.all([
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
    fetchEarnings({
      filters: {
        user_id: userId,
        date: { gte: range3.startDate, lte: range3.endDate },
      },
    }),
    fetchEarnings({
      filters: {
        user_id: userId,
        date: { gte: range4.startDate, lte: range4.endDate },
      },
    }),
  ]);

  // Fetch savings for all 4 months in parallel
  const [savingsCurrent, savingsMonth2, savingsMonth3, savingsMonth4] = await Promise.all([
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
    fetchSavings({
      filters: {
        user_id: userId,
        date: { gte: range3.startDate, lte: range3.endDate },
      },
    }),
    fetchSavings({
      filters: {
        user_id: userId,
        date: { gte: range4.startDate, lte: range4.endDate },
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

  // Get unique categories from expenses and earnings
  const allCategories = Array.from(
    new Map(
      [
        ...expensesCurrent.map((e) => e.category),
        ...earningsCurrent.map((e) => e.category),
      ].map((category) => [category.id, category])
    ).values()
  );

  // Prepare 4 months of data for AI advisor
  const monthsData = [
    {
      label: `Month 1 (Current)`,
      month: month1.month,
      year: month1.year,
      expenses: expensesCurrent,
      earnings: earningsCurrent,
      savings: savingsCurrent,
    },
    {
      label: `Month 2`,
      month: month2.month,
      year: month2.year,
      expenses: expensesMonth2,
      earnings: earningsMonth2,
      savings: savingsMonth2,
    },
    {
      label: `Month 3`,
      month: month3.month,
      year: month3.year,
      expenses: expensesMonth3,
      earnings: earningsMonth3,
      savings: savingsMonth3,
    },
    {
      label: `Month 4`,
      month: month4.month,
      year: month4.year,
      expenses: expensesMonth4,
      earnings: earningsMonth4,
      savings: savingsMonth4,
    },
  ];

  // User goal data
  const userGoal = user?.goalAmount
    ? {
        amount: Number(user.goalAmount),
        timeframe: user.goalTimeframe || "monthly",
        description: user.goalDescription || "",
      }
    : null;

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
                <FinancialAdvisor
                  userName={user?.name || ""}
                  monthsData={monthsData}
                  userGoal={userGoal}
                />
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
                      currentExpenses={expensesCurrent}
                      previousExpenses={expensesPrevious}
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
