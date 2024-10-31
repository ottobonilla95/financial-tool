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
    Record<string, { name: string; amount: number }>
  > = {};

  // Aggregate expenses by emotion name and category
  expenses.forEach((expense) => {
    const emotionName = expense.emotion?.name || "Unknown";
    const categoryId = expense.category.id;

    if (!emotionMap[emotionName]) {
      emotionMap[emotionName] = {};
    }

    if (!emotionMap[emotionName][categoryId]) {
      emotionMap[emotionName][categoryId] = {
        name: expense.category.name,
        amount: 0,
      };
    }

    emotionMap[emotionName][categoryId].amount += expense.amount;
  });

  // Sort categories by amount within each emotion
  const topCategoriesByEmotion = Object.entries(emotionMap).map(
    ([emotionName, categories]) => {
      const sortedCategories = Object.values(categories).sort(
        (a, b) => b.amount - a.amount
      );
      return {
        emotionName,
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
    <section className="mt-8 p-4 bg-white rounded-sm shadow-sm">
      <h2 className="font-semibold mb-4 uppercase text-neutral-600">
        {dict.psychologyPage.spendingByEmotion}
      </h2>
      <div className="space-y-6">
        {topCategoriesByEmotion.length > 0 ? (
          topCategoriesByEmotion.map((emotionData) => (
            <EmotionCategoryItem
              key={emotionData.emotionName}
              emotionData={emotionData}
              dict={dict}
            />
          ))
        ) : (
          <p>No emotion-driven data available.</p>
        )}
      </div>
    </section>
  );
};
