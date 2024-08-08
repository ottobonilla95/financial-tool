import { lusitana } from "@/src/styles/fonts";
import { fetchMonthExpenses } from "@/src/data/expenses";
import { auth } from "@/auth";
import {
  DashboardButtons,
  DashboardDatePicker,
  ExpensesPieChart,
  ExpensesWrapper,
} from "@/src/ui/dashboard";

export type DashboardPageProps = {
  searchParams: {
    month: string;
    year: string;
  };
};
export default async function Page({ searchParams }: DashboardPageProps) {
  const session = await auth();
  const userId = session?.user?.id as string;

  const currentDate = new Date();

  const month = Number(searchParams.month) || currentDate.getMonth() + 1;
  const year = Number(searchParams.year) || currentDate.getFullYear();

  const expenses = await fetchMonthExpenses(userId, month, year);

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <DashboardButtons />
      <DashboardDatePicker />
      <div className="w-full">
        <ExpensesPieChart expenses={expenses} />
      </div>
      <div>
        <ExpensesWrapper expenses={expenses} />
      </div>
    </main>
  );
}
