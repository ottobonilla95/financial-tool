import { Expense } from "@/src/types";
import { AppDictionary } from "@/src/translations";
import { DashboardTotalBox } from "./total-box";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { capitalizeFirstLetter } from "@/src/helpers/capitalize-first-letter";
import { lightenHexColor } from "@/src/helpers/modify-color";

// Helper function to calculate totals per category
const calculateTotalsPerCategory = (expenses: Expense[]) => {
  return expenses.reduce((acc, expense) => {
    const { category, amount } = expense;

    if (!acc[category.name]) {
      acc[category.name] = 0;
    }

    acc[category.name] += amount;

    return acc;
  }, {} as Record<string, number>);
};

// Function to calculate totals for both months in the specified format
const calculateMonthlyTotals = (
  expenses: Expense[],
  expensesPrevious: Expense[]
) => {
  const currentMonthTotals = calculateTotalsPerCategory(expenses);
  const previousMonthTotals = calculateTotalsPerCategory(expensesPrevious);

  // Merge all unique categories and include color in the totals
  const allCategories = new Set([
    ...Object.keys(currentMonthTotals),
    ...Object.keys(previousMonthTotals),
  ]);
  const monthlyTotals = {} as Record<
    string,
    { current: number; previous: number; color: string }
  >;

  allCategories.forEach((category) => {
    const currentCategory = expenses.find(
      (exp) => exp.category.name === category
    )?.category;
    const previousCategory = expensesPrevious.find(
      (exp) => exp.category.name === category
    )?.category;

    monthlyTotals[category] = {
      current: currentMonthTotals[category] || 0,
      previous: previousMonthTotals[category] || 0,
      color: currentCategory?.color || previousCategory?.color || "grey",
    };
  });

  return monthlyTotals;
};

export type ExpenseTotalsPerCategoryProps = {
  expenses: Expense[];
  expensesPrevious: Expense[];

  dict: AppDictionary;
};

export const ExpenseTotalsPerCategory = ({
  expenses,
  expensesPrevious,
  dict,
}: ExpenseTotalsPerCategoryProps) => {
  const monthlyTotals = calculateMonthlyTotals(expenses, expensesPrevious);

  return (
    <div>
      <div className="font-bold mb-5 text-gray-600 uppercase">
        {dict.dashboard.totalExpensesPerCategory}
      </div>

      <div className="flex flex-col md:flex-row mb-5 gap-2 md:flex-wrap">
        {Object.keys(monthlyTotals).map((category) => (
          <DashboardTotalBox
            icon={<BanknotesIcon className="w-5" />}
            label={capitalizeFirstLetter(category)}
            topLineStyles={{
              backgroundColor: monthlyTotals[category].color,
            }}
            value={monthlyTotals[category].current}
            previousMonthValue={monthlyTotals[category].previous}
            negativeIncrease
            variant="topline"
          />
        ))}
      </div>
    </div>
  );
};
