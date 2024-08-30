import { auth } from "@/auth";
import { AppProvider } from "@/src/app-wrappper/provider";
import { fetchExpenses } from "@/src/data/expenses";
import { getDBUser } from "@/src/data/user";
import { Currency } from "@/src/types";
import { NoExpensesAdded } from "@/src/ui/dashboard";
import { TotalLineChart } from "@/src/ui/insights";

export default async function Page() {
  const session = await auth();
  const userId = session?.user?.id as string;

  const expenses = await fetchExpenses({
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
      <main>
        {expenses.length === 0 && expenses.length === 0 && <NoExpensesAdded />}
        {expenses.length > 0 && <TotalLineChart expenses={expenses} />}
      </main>
    </AppProvider>
  );
}
