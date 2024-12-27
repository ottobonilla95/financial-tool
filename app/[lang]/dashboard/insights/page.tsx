import { auth } from "@/auth";
import { AppProvider } from "@/src/app-wrappper/provider";
import { fetchExpenses } from "@/src/data/expenses";
import { fetchEarnings } from "@/src/data/earning";
import { fetchSavings } from "@/src/data/saving";
import { getDBUser } from "@/src/data/user";
import { Currency, SubscriptionPlanOption } from "@/src/types";
import { NoExpensesAdded, LastUpdated } from "@/src/ui/financial-app/dashboard";
import { TotalLineChart } from "@/src/ui/financial-app/insights";
import { AvailableLanguages, getDictionary } from "@/src/translations";
import { Suspense } from "react";
import { redirect } from "next/navigation";

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

  const earnings = await fetchEarnings({
    filters: {
      user_id: userId,
    },
  });
  const savings = await fetchSavings({
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
          currencyCode: true,
          countryCode: true,
        },
      },
    },
  });

  const currency = user?.currency;

  const isPremium = user?.subscriptionPlan !== SubscriptionPlanOption.Free;
  const stripeCustomerPortalLink = `${process.env.STRIPE_CUSTOMER_PORTAL_URL}?prefilled_email=${user?.email}`;
  const isUserOnStripe = Boolean(user?.stripeId);

  if (!user?.subscriptionPlan) {
    redirect("/dashboard/pricing");
  }
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
            <TotalLineChart
              expenses={expenses}
              earnings={earnings}
              savings={savings}
              currency={currency as Currency}
              dict={dict}
            />
          )}
        </div>
      </main>
    </AppProvider>
  );
}
