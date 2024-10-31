import { Expense } from "@/src/types";

// Helper function to process expenses and calculate emotion-driven categories
export function calculateEmotionDrivenCategories(expenses: Expense[]) {
  const emotionCategoryMap: Record<string, Record<string, number>> = {};

  // Aggregate expenses by category and emotion type
  expenses.forEach((expense) => {
    const categoryId = expense.category.id;
    const emotionType = expense.emotion?.emotionType || "Unknown";

    if (!emotionCategoryMap[categoryId]) {
      emotionCategoryMap[categoryId] = {};
    }

    if (!emotionCategoryMap[categoryId][emotionType]) {
      emotionCategoryMap[categoryId][emotionType] = 0;
    }

    emotionCategoryMap[categoryId][emotionType] += expense.amount;
  });

  // Identify the dominant emotion for each category
  const emotionDrivenCategories = Object.entries(emotionCategoryMap).map(
    ([categoryId, emotions]) => {
      const dominantEmotion = Object.entries(emotions).reduce((a, b) =>
        a[1] > b[1] ? a : b
      );

      const category = expenses.find(
        (exp) => exp.category.id === categoryId
      )?.category;

      return {
        category,
        emotionType: dominantEmotion[0],
        totalAmount: dominantEmotion[1],
      };
    }
  );

  return emotionDrivenCategories.filter((item) => item.category);
}
