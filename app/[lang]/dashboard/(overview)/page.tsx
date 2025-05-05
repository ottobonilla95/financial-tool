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
  const currentDate = new Date();

  // Use month and year from searchParams if provided, otherwise use current month and year
  const selectedMonth =
    Number(searchParams.month) || currentDate.getMonth() + 1;

  const selectedYear = Number(searchParams.year) || currentDate.getFullYear();
  const missingParams = !searchParams.month || !searchParams.year;
  // Check if parameters are missing

  if (missingParams) {
    redirect(`/dashboard?month=${selectedMonth}&year=${selectedYear}`);
    return null;
  }
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

  // Current month start and end dates
  const startDateCurrent = new Date(
    Date.UTC(selectedYear, selectedMonth - 1, 1, 0, 0, 0)
  ); // Start of the month at 00:00 UTC
  const endDateCurrent = isCurrentMonth
    ? new Date(
        Date.UTC(
          selectedYear,
          selectedMonth - 1,
          Math.min(dayOfMonth, endOfMonth(startDateCurrent).getDate()),
          23,
          59,
          59
        )
      ) // Up to today at 23:59:59 UTC if current month
    : new Date(Date.UTC(selectedYear, selectedMonth, 0, 23, 59, 59)); // Full month if not current

  // Previous month start and end dates
  const startDatePrevious = new Date(
    Date.UTC(
      startDateCurrent.getUTCFullYear(),
      startDateCurrent.getUTCMonth() - 1,
      1,
      0,
      0,
      0
    )
  ); // Start of previous month at 00:00 UTC
  const endDatePrevious = isCurrentMonth
    ? dayOfMonth <= endOfMonth(startDatePrevious).getDate()
      ? new Date(
          Date.UTC(
            startDatePrevious.getUTCFullYear(),
            startDatePrevious.getUTCMonth(),
            dayOfMonth,
            23,
            59,
            59
          )
        ) // Up to the same day as today in the previous month at 23:59:59 UTC
      : new Date(
          Date.UTC(
            startDatePrevious.getUTCFullYear(),
            startDatePrevious.getUTCMonth() + 1,
            0,
            23,
            59,
            59
          )
        ) // Last day of the previous month if today's day doesn't exist in that month
    : new Date(
        Date.UTC(
          startDatePrevious.getUTCFullYear(),
          startDatePrevious.getUTCMonth() + 1,
          0,
          23,
          59,
          59
        )
      ); // Full month if not current

  // Fetch expenses for the current month up to today's date
  const expensesCurrent = await fetchExpenses({
    filters: {
      user_id: userId,
      date: {
        gte: startDateCurrent,
        lte: endDateCurrent,
      },
    },
  });

  // Fetch expenses for the previous month up to the same day as today
  const expensesPrevious = await fetchExpenses({
    filters: {
      user_id: userId,
      date: {
        gte: startDatePrevious,
        lte: endDatePrevious,
      },
    },
  });

  // Fetch earnings for the current month up to today's date
  const earningsCurrent = await fetchEarnings({
    filters: {
      user_id: userId,
      date: {
        gte: startDateCurrent,
        lte: endDateCurrent,
      },
    },
  });

  // Fetch earnings for the previous month up to the same day as today
  const earningsPrevious = await fetchEarnings({
    filters: {
      user_id: userId,
      date: {
        gte: startDatePrevious,
        lte: endDatePrevious,
      },
    },
  });

  // Fetch savings for the current month up to today's date
  const savingsCurrent = await fetchSavings({
    filters: {
      user_id: userId,
      date: {
        gte: startDateCurrent,
        lte: endDateCurrent,
      },
    },
  });

  // Fetch savings for the previous month up to the same day as today
  const savingsPrevious = await fetchSavings({
    filters: {
      user_id: userId,
      date: {
        gte: startDatePrevious,
        lte: endDatePrevious,
      },
    },
  });

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
                  expenses={expensesCurrent}
                  earnings={earningsCurrent}
                  savings={savingsCurrent}
                  expensesPrevious={expensesPrevious}
                  earningsPrevious={earningsPrevious}
                  savingsPrevious={savingsPrevious}
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
