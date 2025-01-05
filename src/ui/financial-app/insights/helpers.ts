import { Earning, Expense, Saving } from "@/src/types";

export function getMonthlyTotals(
  expenses: Expense[],
  earnings: Earning[],
  savings: Saving[]
) {
  function getMonthYear(dateString: string) {
    // Parse date as UTC and extract the correct month and year
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = date.toLocaleString("en-US", {
      month: "long",
      timeZone: "UTC",
    });
    return `${month} ${year}`;
  }

  const monthlyTotals: {
    [monthYear: string]: {
      expenses: number;
      earnings: number;
      savings: number;
    };
  } = {};

  expenses.forEach((expense) => {
    const monthYear = getMonthYear(expense.date?.toISOString() || "");

    if (!monthlyTotals[monthYear]) {
      monthlyTotals[monthYear] = { expenses: 0, earnings: 0, savings: 0 };
    }

    monthlyTotals[monthYear].expenses += expense.amount;
  });
  earnings.forEach((earning) => {
    const monthYear = getMonthYear(earning.date.toISOString());

    if (!monthlyTotals[monthYear]) {
      monthlyTotals[monthYear] = { expenses: 0, earnings: 0, savings: 0 };
    }

    monthlyTotals[monthYear].earnings += earning.amount;
  });
  savings.forEach((saving) => {
    const monthYear = getMonthYear(saving.date.toISOString());

    if (!monthlyTotals[monthYear]) {
      monthlyTotals[monthYear] = { expenses: 0, earnings: 0, savings: 0 };
    }

    monthlyTotals[monthYear].savings += saving.amount;
  });

  return Object.entries(monthlyTotals)
    .sort(([a], [b]) => {
      const dateA = new Date(`${a} 1`); // Append '1' to make it a valid date
      const dateB = new Date(`${b} 1`);
      return dateA.getTime() - dateB.getTime();
    })
    .map(([monthYear, totals]) => ({
      monthYear,
      expenses: parseFloat(totals.expenses.toFixed(2)),
      earnings: parseFloat(totals.earnings.toFixed(2)),
      savings: parseFloat(totals.savings.toFixed(2)),
    }));
}

export function getAllUniqueMonths(expenses: Expense[]) {
  const uniqueMonths = new Set<string>();

  expenses.forEach((expense) => {
    const monthYear = expense.date?.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
    uniqueMonths.add(monthYear || "");
  });

  return Array.from(uniqueMonths).sort(); // Sort to ensure consistent order
}

export function groupExpensesByCategoryWithAllMonths(
  expenses: Expense[],
  allMonths: string[]
) {
  const groupedExpenses: {
    [categoryName: string]: {
      totals: { date: string; amount: number }[];
      subcategories: {
        [subcategoryName: string]: { date: string; amount: number }[];
      };
    };
  } = {};

  function getMonthYearUTC(date: Date) {
    const year = date.getUTCFullYear();
    const month = date.toLocaleString("en-US", {
      month: "long",
      timeZone: "UTC",
    });
    return `${month} ${year}`;
  }

  expenses.forEach((expense) => {
    const categoryName = expense.category.name;
    const subcategoryName = expense.subcategory.name;
    const monthYear = getMonthYearUTC(expense.date); // Pass the Date object directly

    // Initialize the category if it doesn't exist
    if (!groupedExpenses[categoryName]) {
      groupedExpenses[categoryName] = { totals: [], subcategories: {} };
    }

    // Add the amount to the category totals
    const categoryTotals = groupedExpenses[categoryName].totals;
    const categoryEntry = categoryTotals.find(
      (entry) => entry.date === monthYear
    );
    if (categoryEntry) {
      categoryEntry.amount += expense.amount;
    } else {
      categoryTotals.push({ date: monthYear, amount: expense.amount });
    }

    // Initialize the subcategory if it doesn't exist
    if (!groupedExpenses[categoryName].subcategories[subcategoryName]) {
      groupedExpenses[categoryName].subcategories[subcategoryName] = [];
    }

    // Add the amount to the subcategory
    const subcategoryTotals =
      groupedExpenses[categoryName].subcategories[subcategoryName];
    const subcategoryEntry = subcategoryTotals.find(
      (entry) => entry.date === monthYear
    );
    if (subcategoryEntry) {
      subcategoryEntry.amount += expense.amount;
    } else {
      subcategoryTotals.push({ date: monthYear, amount: expense.amount });
    }
  });

  // Ensure every category and subcategory has all months with zeroes if missing
  Object.keys(groupedExpenses).forEach((categoryName) => {
    const categoryData = groupedExpenses[categoryName];

    // Add missing months for the category
    allMonths.forEach((monthYear) => {
      if (!categoryData.totals.find((entry) => entry.date === monthYear)) {
        categoryData.totals.push({ date: monthYear, amount: 0 });
      }
    });

    // Add missing months for each subcategory
    Object.keys(categoryData.subcategories).forEach((subcategoryName) => {
      const subcategoryData = categoryData.subcategories[subcategoryName];
      allMonths.forEach((monthYear) => {
        if (!subcategoryData.find((entry) => entry.date === monthYear)) {
          subcategoryData.push({ date: monthYear, amount: 0 });
        }
      });
    });
    // Sort the category totals by date
    categoryData.totals.sort((a, b) => {
      const dateA = new Date(`${a.date} 1 UTC`);
      const dateB = new Date(`${b.date} 1 UTC`);
      return dateA.getTime() - dateB.getTime();
    });

    // Sort each subcategory's totals by date
    Object.keys(categoryData.subcategories).forEach((subcategoryName) => {
      categoryData.subcategories[subcategoryName].sort((a, b) => {
        const dateA = new Date(`${a.date} 1 UTC`);
        const dateB = new Date(`${b.date} 1 UTC`);
        return dateA.getTime() - dateB.getTime();
      });
    });
  });

  return groupedExpenses;
}

export function getChartDataForCategory(
  groupedExpenses: any,
  categoryName: string
) {
  const categoryData = groupedExpenses[categoryName];

  if (!categoryData) return [];

  // Ensure the data is sorted by month for consistency in graph rendering
  const monthlyTotals: {
    [monthYear: string]: { category: number; [subcategory: string]: number };
  } = {};

  // Initialize with zeros for all months
  categoryData.totals.forEach((entry: { date: string }) => {
    if (!monthlyTotals[entry.date]) {
      monthlyTotals[entry.date] = { category: 0 };
    }
  });

  // Add actual category totals
  categoryData.totals.forEach((entry: { date: string; amount: number }) => {
    monthlyTotals[entry.date].category = entry.amount;
  });

  // Add actual subcategory totals
  Object.keys(categoryData.subcategories).forEach((subcategoryName) => {
    categoryData.subcategories[subcategoryName].forEach(
      (entry: { date: string; amount: number }) => {
        if (!monthlyTotals[entry.date]) {
          monthlyTotals[entry.date] = { category: 0 };
        }
        monthlyTotals[entry.date][subcategoryName] = entry.amount;
      }
    );
  });

  // Convert to array of objects
  return Object.entries(monthlyTotals).map(([monthYear, totals]) => ({
    monthYear,
    ...totals,
  }));
}

export const colors = [
  "#36a2eb", // Blue
  "#cc65fe", // Purple
  "#ffce56", // Yellow
  "#2ecc71", // Green
  "#f39c12", // Orange
  "#e74c3c", // Dark Red
  "#8e44ad", // Dark Purple
  "#3498db", // Light Blue
  "#000000", // Black
];
