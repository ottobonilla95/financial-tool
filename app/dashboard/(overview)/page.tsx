import { lusitana } from "@/src/styles/fonts";
import { fetchMonthExpenses } from "@/src/data/expenses";
import { ExpensesPieChart, ExpensesWrapper } from "@/src/ui/components";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  const userId = session?.user?.id as string;

  const expenses = await fetchMonthExpenses(userId);

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="w-full">
        <ExpensesPieChart expenses={expenses} />
      </div>
      <div>
        <ExpensesWrapper expenses={expenses} />
      </div>
    </main>
  );
}
