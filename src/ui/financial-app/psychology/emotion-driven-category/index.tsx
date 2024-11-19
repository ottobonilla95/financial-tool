import React from "react";
import { Expense } from "@/src/types";
import { EmotionCategoryItem } from "./emotion-category-item";
import { AppDictionary } from "@/src/translations";

type EmotionCategoryListProps = {
  expenses: Expense[];
  dict: AppDictionary;
};

// Helper function to process expenses and calculate top categories by emotion
function calculateTopCategoriesByEmotion(expenses: Expense[]) {
  const emotionMap: Record<
    string,
    {
      color: string;
      emotionType: string;
      categories: Record<string, { name: string; amount: number }>;
    }
  > = {};

  // Aggregate expenses by emotion name and category
  expenses
    .filter((expense) => expense.emotion.name !== "neutral")
    .forEach((expense) => {
      const emotionName = expense.emotion?.name || "Unknown";
      const emotionColor = expense.emotion?.color || "gray"; // Default to gray if color is missing
      const emotionType = expense.emotion?.emotionType || "unknown"; // Default to "unknown" if emotionType is missing
      const categoryId = expense.category.id;

      if (!emotionMap[emotionName]) {
        emotionMap[emotionName] = {
          color: emotionColor,
          emotionType: emotionType,
          categories: {},
        };
      }

      if (!emotionMap[emotionName].categories[categoryId]) {
        emotionMap[emotionName].categories[categoryId] = {
          name: expense.category.name,
          amount: 0,
        };
      }

      emotionMap[emotionName].categories[categoryId].amount += expense.amount;
    });

  // Sort categories by amount within each emotion
  const topCategoriesByEmotion = Object.entries(emotionMap).map(
    ([emotionName, { color, emotionType, categories }]) => {
      const sortedCategories = Object.values(categories).sort(
        (a, b) => b.amount - a.amount
      );
      return {
        emotionName,
        color, // Include color for each emotion
        emotionType, // Include emotionType for each emotion
        categories: sortedCategories,
      };
    }
  );

  return topCategoriesByEmotion;
}

export const EmotionCategoryList = ({
  expenses,
  dict,
}: EmotionCategoryListProps) => {
  const topCategoriesByEmotion = calculateTopCategoriesByEmotion(expenses);

  return (
    <>
      <section className="mt-8 p-4 bg-white rounded-sm shadow-sm">
        <h2 className="font-semibold mb-4 uppercase text-neutral-600">
          {dict.psychologyPage.whereYouSpendTheMostByEmotion}
        </h2>
        <div className="space-y-6">
          {topCategoriesByEmotion.length > 0 &&
            topCategoriesByEmotion.map((emotionData) => (
              <EmotionCategoryItem
                key={emotionData.emotionName}
                emotionData={emotionData}
                dict={dict}
              />
            ))}
        </div>
      </section>
      <div className="h-[200px]" />
    </>
  );
};
