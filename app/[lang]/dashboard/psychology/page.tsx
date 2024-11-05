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
  EmotionCategoryList,
} from "@/src/ui/financial-app/psychology";
import { Button } from "@/src/ui/components";
import clsx from "clsx";

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
        {!isPremium && (
          <>
            <div
              className="bg-black inset-0 absolute blur-sm rounded-md z-[1000]"
              style={{ opacity: "5%" }}
            />
            <div className="inset-0 absolute flex pt-10 items-center justify-center z-[10001]">
              <div className="w-full max-w-[400px] p-5 bg-white rounded-md border border-gray-200 border-solid">
                <div className="text-lg font-bold  mb-3">
                  {dict.shared?.subscriptionMessages.psychologyPagePremiumTitle}
                </div>
                <div className=" mb-3">
                  {
                    dict.shared?.subscriptionMessages
                      .psychologyPagePremiumMessage
                  }
                </div>
                {isUserOnStripe ? (
                  <Button
                    href={stripeCustomerPortalLink}
                    target="_blank"
                    className="text-white bg-black"
                  >
                    {`${dict.shared?.manageSubscription}`}
                  </Button>
                ) : (
                  <Button
                    href="/dashboard/pricing"
                    className="text-white bg-black"
                  >{`${dict.shared?.goPremium}`}</Button>
                )}
              </div>
            </div>
          </>
        )}
        <Suspense fallback={<div>loading...</div>}>
          <LastUpdated dict={dict} />
        </Suspense>
        <div
          className={clsx("relative p-4 md:p-10", {
            "blur-sm": !isPremium,
          })}
        >
          {expenses.length === 0 && expenses.length === 0 && (
            <NoExpensesAdded dict={dict} />
          )}
          {expenses.length > 0 && (
            <>
              <div
                className={clsx("flex flex-col xl:flex-row gap-4 w-full", {
                  "blur-sm": !isPremium,
                })}
              >
                <div className="flex-1">
                  <EmotionSpendingPatternsGraph
                    expenses={expenses}
                    dict={dict}
                  />
                </div>
                <div className="flex-1">
                  <SatisfactionSpendingPatternsGraph
                    expenses={expenses}
                    dict={dict}
                  />
                </div>
              </div>
              <EmotionCategoryList expenses={expenses} dict={dict} />
            </>
          )}
        </div>
      </main>
    </AppProvider>
  );
}
