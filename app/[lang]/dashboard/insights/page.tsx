import { auth } from "@/auth";
import { AppProvider } from "@/src/app-wrappper/provider";
import { fetchExpenses } from "@/src/data/expenses";
import { fetchEarnings } from "@/src/data/earning";
import { fetchSavings } from "@/src/data/saving";
import { getDBUser } from "@/src/data/user";
import { Currency } from "@/src/types";
import { NoExpensesAdded } from "@/src/ui/dashboard";
import { TotalLineChart } from "@/src/ui/insights";
import { AvailableLanguages, getDictionary } from "@/src/translations";

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

  return (
    <AppProvider currency={currency as Currency}>
      <main className="p-6 md:p-10">
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
      </main>
    </AppProvider>
  );
}
