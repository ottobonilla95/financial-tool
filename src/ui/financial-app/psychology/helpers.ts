import { Expense } from "@/src/types";
import { AppDictionary } from "@/src/translations";

export function getAllUniqueMonths(expenses: Expense[]) {
  const uniqueMonths = new Set<string>();

  expenses.forEach((expense) => {
    const monthYear = expense.date?.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
    uniqueMonths.add(monthYear || "");
  });

  return Array.from(uniqueMonths).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA.getTime() - dateB.getTime();
  });
}

export function groupExpensesByEmotionWithPercentages(
  expenses: Expense[],
  allMonths: string[]
): Record<string, { [month: string]: number }> {
  const monthlyTotals: { [month: string]: number } = {};
  const groupedByEmotion: Record<string, { [month: string]: number }> = {};

  // Calculate total spending per month
  allMonths.forEach((month) => {
    monthlyTotals[month] = 0;
  });

  expenses.forEach((expense) => {
    const monthYear = new Date(expense.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
    monthlyTotals[monthYear] += expense.amount;
  });

  // Initialize each emotion with all months set to 0
  expenses.forEach((expense) => {
    const emotionName = expense.emotion?.name || "Unspecified Emotion";
    if (!groupedByEmotion[emotionName]) {
      groupedByEmotion[emotionName] = {};
    }
    allMonths.forEach((month) => {
      if (!groupedByEmotion[emotionName][month]) {
        groupedByEmotion[emotionName][month] = 0;
      }
    });
  });

  // Populate the spending percentage per emotion and month
  expenses.forEach((expense) => {
    const emotionName = expense.emotion?.name || "Unspecified Emotion";
    const monthYear = new Date(expense.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
    const monthlyTotal = monthlyTotals[monthYear];

    if (monthlyTotal > 0) {
      groupedByEmotion[emotionName][monthYear] +=
        (expense.amount / monthlyTotal) * 100;
    }
  });

  return groupedByEmotion;
}

export const emotionColors = {
  sadness: "#6b7280", // Gray for Sadness
  happiness: "#4ade80", // Green for Happiness
  stress: "#f87171", // Red for Stress
  boredom: "#fbbf24", // Yellow for Boredom
  excitement: "#60a5fa", // Blue for Excitement
  guilt: "#f472b6", // Pink for Guilt
  neutral: "#d1d5db", // Light Gray for Neutral
  anxiety: "#eab308", // Gold for Anxiety
};

// Helper to group expenses by satisfaction level with percentage calculations per month
export function groupExpensesBySatisfactionWithPercentages(
  expenses: Expense[],
  allMonths: string[],
  dict: AppDictionary
): Record<string, { [month: string]: number }> {
  const monthlyTotals: { [month: string]: number } = {};
  const groupedBySatisfaction: Record<string, { [month: string]: number }> = {};

  // Mapping numeric levels to dictionary labels
  const satisfactionLabels = {
    1: dict.shared.satisfactionLevels.veryUnsatisfied,
    2: dict.shared.satisfactionLevels.unsatisfied,
    3: dict.shared.satisfactionLevels.neutral,
    4: dict.shared.satisfactionLevels.satisfied,
    5: dict.shared.satisfactionLevels.verySatisfied,
  };

  // Calculate total spending per month
  allMonths.forEach((month) => {
    monthlyTotals[month] = 0;
  });

  expenses.forEach((expense) => {
    const monthYear = new Date(expense.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
    monthlyTotals[monthYear] += expense.amount;
  });

  // Initialize each satisfaction label with all months set to 0
  Object.values(satisfactionLabels).forEach((satisfactionLabel) => {
    if (!groupedBySatisfaction[satisfactionLabel]) {
      groupedBySatisfaction[satisfactionLabel] = {};
    }
    allMonths.forEach((month) => {
      if (!groupedBySatisfaction[satisfactionLabel][month]) {
        groupedBySatisfaction[satisfactionLabel][month] = 0;
      }
    });
  });

  // Populate the spending percentage per satisfaction level and month
  expenses.forEach((expense) => {
    const satisfactionLabel =
      satisfactionLabels[
        expense.satisfaction as keyof typeof satisfactionLabels
      ];
    const monthYear = new Date(expense.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
    const monthlyTotal = monthlyTotals[monthYear];

    if (monthlyTotal > 0) {
      groupedBySatisfaction[satisfactionLabel][monthYear] +=
        (expense.amount / monthlyTotal) * 100;
    }
  });

  return groupedBySatisfaction;
}
