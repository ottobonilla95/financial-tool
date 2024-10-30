import { auth } from "@/auth";
import { AppProvider } from "@/src/app-wrappper/provider";
import { fetchExpenses } from "@/src/data/expenses";
import { getDBUser } from "@/src/data/user";
import { Currency, SubscriptionPlanOption } from "@/src/types";
import { NoExpensesAdded, LastUpdated } from "@/src/ui/financial-app/dashboard";
import { AvailableLanguages, getDictionary } from "@/src/translations";
import { Suspense } from "react";
import {
  EmotionSpendingPatternsGraph,
  SatisfactionSpendingPatternsGraph,
} from "@/src/ui/financial-app/psychology";

export type InsightsPageProps = {
  params: { lang: AvailableLanguages };
};

export default async function Page({ params: { lang } }: InsightsPageProps) {
  const dict = await getDictionary(lang);

  const session = await auth();
  const userId = session?.user?.id as string;

  const expenses = await fetchExpenses({
    filters: {
      user_id: userId,
    },
  });

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
    },
  });

  const currency = user?.currency;

  const isPremium = user?.subscriptionPlan !== SubscriptionPlanOption.Free;
  const stripeCustomerPortalLink = `${process.env.STRIPE_CUSTOMER_PORTAL_URL}?prefilled_email=${user?.email}`;
  const isUserOnStripe = Boolean(user?.stripeId);

  return (
    <AppProvider
      currency={currency as Currency}
      subscriptionDetails={{
        isPremium,
        stripeCustomerPortalLink,
        isUserOnStripe,
      }}
    >
      <main>
        <Suspense fallback={<div>loading...</div>}>
          <LastUpdated dict={dict} />
        </Suspense>
        <div className="p-4 md:p-10">
          {expenses.length === 0 && expenses.length === 0 && (
            <NoExpensesAdded dict={dict} />
          )}
          {expenses.length > 0 && (
            <div className="flex flex-col xl:flex-row gap-4 w-full">
              <div className="flex-1">
                <EmotionSpendingPatternsGraph expenses={expenses} dict={dict} />
              </div>
              <div className="flex-1">
                <SatisfactionSpendingPatternsGraph
                  expenses={expenses}
                  dict={dict}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </AppProvider>
  );
}
