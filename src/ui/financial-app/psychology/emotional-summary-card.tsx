"use client";

import { Expense } from "@/src/types";
import { AppDictionary } from "@/src/translations";
import { useMemo } from "react";
import { Brain, Heart, TrendingUp, TrendingDown } from "lucide-react";

export type EmotionalSummaryCardProps = {
  expenses: Expense[];
  expensesPreviousMonth: Expense[];
  dict: AppDictionary;
  currencySymbol: string;
};

type EmotionStats = {
  name: string;
  total: number;
  percentage: number;
  color: string;
  count: number;
};

type CategoryEmotionTrigger = {
  category: string;
  topEmotion: string;
  emotionColor: string;
  total: number;
};

export const EmotionalSummaryCard = ({
  expenses,
  expensesPreviousMonth,
  dict,
  currencySymbol,
}: EmotionalSummaryCardProps) => {
  const stats = useMemo(() => {
    // Calculate emotion totals
    const emotionTotals: Record<string, EmotionStats> = {};
    let totalExpenses = 0;
    let totalSatisfaction = 0;
    let satisfactionCount = 0;

    expenses.forEach((expense) => {
      totalExpenses += expense.amount;

      if (expense.satisfaction) {
        totalSatisfaction += expense.satisfaction;
        satisfactionCount++;
      }

      const emotionName = expense.emotion?.name || "neutral";
      const emotionColor = expense.emotion?.color || "#6b7280";

      if (!emotionTotals[emotionName]) {
        emotionTotals[emotionName] = {
          name: emotionName,
          total: 0,
          percentage: 0,
          color: emotionColor,
          count: 0,
        };
      }

      emotionTotals[emotionName].total += expense.amount;
      emotionTotals[emotionName].count++;
    });

    // Calculate percentages
    Object.values(emotionTotals).forEach((emotion) => {
      emotion.percentage = totalExpenses > 0
        ? (emotion.total / totalExpenses) * 100
        : 0;
    });

    // Find top emotion
    const sortedEmotions = Object.values(emotionTotals).sort(
      (a, b) => b.total - a.total
    );
    const topEmotion = sortedEmotions[0];

    // Calculate average satisfaction
    const avgSatisfaction = satisfactionCount > 0
      ? totalSatisfaction / satisfactionCount
      : 0;

    // Find category with biggest emotional trigger
    const categoryEmotions: Record<string, Record<string, { total: number; color: string }>> = {};
    expenses.forEach((expense) => {
      const category = expense.category.name;
      const emotion = expense.emotion?.name || "neutral";
      const color = expense.emotion?.color || "#6b7280";

      if (!categoryEmotions[category]) {
        categoryEmotions[category] = {};
      }
      if (!categoryEmotions[category][emotion]) {
        categoryEmotions[category][emotion] = { total: 0, color };
      }
      categoryEmotions[category][emotion].total += expense.amount;
    });

    let biggestTrigger: CategoryEmotionTrigger | null = null;
    let maxEmotionTotal = 0;

    Object.entries(categoryEmotions).forEach(([category, emotions]) => {
      Object.entries(emotions).forEach(([emotion, data]) => {
        if (emotion !== "neutral" && data.total > maxEmotionTotal) {
          maxEmotionTotal = data.total;
          biggestTrigger = {
            category,
            topEmotion: emotion,
            emotionColor: data.color,
            total: data.total,
          };
        }
      });
    });

    // Calculate previous month stats for comparison
    let prevMonthEmotionTotals: Record<string, number> = {};
    expensesPreviousMonth.forEach((expense) => {
      const emotionName = expense.emotion?.name || "neutral";
      if (!prevMonthEmotionTotals[emotionName]) {
        prevMonthEmotionTotals[emotionName] = 0;
      }
      prevMonthEmotionTotals[emotionName] += expense.amount;
    });

    // Calculate change for top emotion
    const topEmotionPrevTotal = topEmotion ? prevMonthEmotionTotals[topEmotion.name] || 0 : 0;
    const topEmotionChange = topEmotionPrevTotal > 0 && topEmotion
      ? ((topEmotion.total - topEmotionPrevTotal) / topEmotionPrevTotal) * 100
      : 0;

    return {
      topEmotion,
      avgSatisfaction,
      biggestTrigger: biggestTrigger as CategoryEmotionTrigger | null,
      topEmotionChange,
      totalExpenses,
    };
  }, [expenses, expensesPreviousMonth]);

  const getEmotionLabel = (emotionName: string) => {
    return dict.forms.expense.create[
      emotionName as keyof typeof dict.forms.expense.create
    ] || emotionName;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
        <Brain className="w-5 h-5" />
        {dict.psychologyPage?.emotionalSummary || "Emotional Spending Summary"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Top Emotion Driver */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500 mb-2">
            {dict.psychologyPage?.topEmotionDriver || "Top Emotion Driver"}
          </div>
          {stats.topEmotion ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: stats.topEmotion.color }}
                />
                <span className="font-semibold text-gray-800">
                  {getEmotionLabel(stats.topEmotion.name)}
                </span>
              </div>
              <div className="text-lg font-bold" style={{ color: stats.topEmotion.color }}>
                {currencySymbol}{stats.topEmotion.total.toFixed(0)} ({stats.topEmotion.percentage.toFixed(1)}%)
              </div>
              {stats.topEmotionChange !== 0 && (
                <div className={`flex items-center gap-1 text-sm mt-1 ${
                  stats.topEmotionChange > 0 ? "text-red-500" : "text-green-500"
                }`}>
                  {stats.topEmotionChange > 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {Math.abs(stats.topEmotionChange).toFixed(0)}% vs last month
                </div>
              )}
            </>
          ) : (
            <div className="text-gray-400">No data</div>
          )}
        </div>

        {/* Average Satisfaction */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500 mb-2">
            {dict.psychologyPage?.avgSatisfaction || "Average Satisfaction"}
          </div>
          <div className="flex items-center gap-2 mb-1">
            <Heart className={`w-5 h-5 ${
              stats.avgSatisfaction >= 4 ? "text-green-500" :
              stats.avgSatisfaction >= 3 ? "text-yellow-500" : "text-red-500"
            }`} />
            <span className="text-2xl font-bold text-gray-800">
              {stats.avgSatisfaction.toFixed(1)}/5
            </span>
          </div>
          <div className="text-sm text-gray-500">
            {stats.avgSatisfaction >= 4 ? (
              dict.psychologyPage?.satisfactionGood || "Great buying decisions!"
            ) : stats.avgSatisfaction >= 3 ? (
              dict.psychologyPage?.satisfactionNeutral || "Room for improvement"
            ) : (
              dict.psychologyPage?.satisfactionPoor || "Many regretful purchases"
            )}
          </div>
        </div>

        {/* Biggest Category Trigger */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500 mb-2">
            {dict.psychologyPage?.biggestTrigger || "Biggest Emotional Trigger"}
          </div>
          {stats.biggestTrigger ? (
            <>
              <div className="font-semibold text-gray-800 mb-1">
                {stats.biggestTrigger.category}
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: stats.biggestTrigger.emotionColor }}
                />
                <span className="text-sm" style={{ color: stats.biggestTrigger.emotionColor }}>
                  {getEmotionLabel(stats.biggestTrigger.topEmotion)}
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {currencySymbol}{stats.biggestTrigger.total.toFixed(0)}
              </div>
            </>
          ) : (
            <div className="text-gray-400">No emotional triggers found</div>
          )}
        </div>
      </div>
    </div>
  );
};
