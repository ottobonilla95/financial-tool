import { fetchExpenses } from "@/src/data/expenses";
import { auth } from "@/auth";
import {
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
  ExpensesByDayGraph,
} from "@/src/ui/financial-app/dashboard";
import { Suspense } from "react";
import { fetchEarnings } from "@/src/data/earning";
import { getAllEmotions } from "@/src/data/emotion";
import { fetchSavings } from "@/src/data/saving";
import { getDBUser } from "@/src/data/user";
import { AppProvider } from "@/src/app-wrappper/provider";
import { Currency, SubscriptionPlanOption } from "@/src/types";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { getDictionary, AvailableLanguages } from "@/src/translations";
import { IntlProvider } from "@/src/translations/provider";
import { Spinner } from "@/src/ui/components";
import TourProvider from "@/src/ui/financial-app/tour/provider";
import TourInitiator from "@/src/ui/financial-app/tour/tour-initiator";

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
      subscription_plan: true,
      email: true,
      stripeId: true,
      currency: {
        select: {
          name: true,
          symbol: true,
        },
      },
      tour_finished: true,
    },
  });

  const isPremium = user?.subscriptionPlan !== SubscriptionPlanOption.Free;
  const stripeCustomerPortalLink = `${process.env.STRIPE_CUSTOMER_PORTAL_URL}?prefilled_email=${user?.email}`;
  const isUserOnStripe = Boolean(user?.stripeId);

  const currency = user?.currency;
  const tourFinished = user?.tourFinished;

  const currentDate = new Date();

  const dayOfMonth = currentDate.getDate();

  const month = Number(searchParams.month) || currentDate.getMonth() + 1;
  const year = Number(searchParams.year) || currentDate.getFullYear();

  // const startDate = startOfMonth(new Date(year, month - 1));
  // const endDate = endOfMonth(new Date(year, month - 1));

  const startDateCurrent = startOfMonth(new Date(year, month - 1));
  const endDateCurrent = new Date(year, month - 1, dayOfMonth);

  const startDatePrevious = startOfMonth(subMonths(startDateCurrent, 1));
  const endDatePrevious = new Date(
    startDatePrevious.getFullYear(),
    startDatePrevious.getMonth(),
    dayOfMonth
  );

  // Fetch expenses for the current month up to today's date
  const expensesCurrent = await fetchExpenses({
    filters: {
      user_id: userId,
      date: {
        gte: startDateCurrent.toISOString(),
        lte: endDateCurrent.toISOString(),
      },
    },
  });

  // Fetch expenses for the previous month up to the same day as today
  const expensesPrevious = await fetchExpenses({
    filters: {
      user_id: userId,
      date: {
        gte: startDatePrevious.toISOString(),
        lte: endDatePrevious.toISOString(),
      },
    },
  });

  // Fetch earnings for the current month up to today's date
  const earningsCurrent = await fetchEarnings({
    filters: {
      user_id: userId,
      date: {
        gte: startDateCurrent.toISOString(),
        lte: endDateCurrent.toISOString(),
      },
    },
  });

  // Fetch earnings for the previous month up to the same day as today
  const earningsPrevious = await fetchEarnings({
    filters: {
      user_id: userId,
      date: {
        gte: startDatePrevious.toISOString(),
        lte: endDatePrevious.toISOString(),
      },
    },
  });

  // Fetch savings for the current month up to today's date
  const savingsCurrent = await fetchSavings({
    filters: {
      user_id: userId,
      date: {
        gte: startDateCurrent.toISOString(),
        lte: endDateCurrent.toISOString(),
      },
    },
  });

  // Fetch savings for the previous month up to the same day as today
  const savingsPrevious = await fetchSavings({
    filters: {
      user_id: userId,
      date: {
        gte: startDatePrevious.toISOString(),
        lte: endDatePrevious.toISOString(),
      },
    },
  });

  const emotions = (await getAllEmotions()).sort((a, b) =>
    a.emotionType.localeCompare(b.emotionType)
  );

  return (
    <AppProvider
      currency={currency as Currency}
      subscriptionDetails={{
        isPremium,
        stripeCustomerPortalLink,
        isUserOnStripe,
      }}
    >
      <IntlProvider dict={dict} lang={lang}>
        <TourProvider>
          <main>
            {!tourFinished && <TourInitiator />}
            <Suspense fallback={<div>loading...</div>}>
              <LastUpdated dict={dict} />
            </Suspense>
            <div className="h-5" />
            <div className="px-6 md:px-12 pb-12">
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
                      <ExpensesPieChart expenses={expensesCurrent} />
                    </div>
                  </div>
                </div>
              )}

              {expensesCurrent.length > 0 && (
                <div className="py-5">
                  <ExpensesByDayGraph expenses={expensesCurrent} dict={dict} />
                </div>
              )}

              {savingsCurrent.length > 0 && (
                <div>
                  <SavingTableContainer savings={savingsCurrent} dict={dict} />
                </div>
              )}
              {earningsCurrent.length > 0 && (
                <div>
                  <IncomeTableContainer
                    earnings={earningsCurrent}
                    dict={dict}
                  />
                </div>
              )}
              {expensesCurrent.length > 0 && (
                <div>
                  <ExpensesTableContainer
                    expenses={expensesCurrent}
                    dict={dict}
                    isPremium={isPremium}
                  />
                </div>
              )}

              {expensesCurrent.length === 0 && earningsCurrent.length === 0 && (
                <NoExpensesAdded dict={dict} />
              )}
            </div>
          </main>
        </TourProvider>
      </IntlProvider>
    </AppProvider>
  );
}
