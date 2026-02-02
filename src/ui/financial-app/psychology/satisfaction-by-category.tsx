"use client";

import { Expense } from "@/src/types";
import { AppDictionary } from "@/src/translations";
import { useMemo } from "react";
import { ThumbsUp, ThumbsDown, Star } from "lucide-react";

export type SatisfactionByCategoryProps = {
  expenses: Expense[];
  dict: AppDictionary;
  currencySymbol: string;
};

type CategorySatisfaction = {
  category: string;
  avgSatisfaction: number;
  totalSpent: number;
  count: number;
};

export const SatisfactionByCategory = ({
  expenses,
  dict,
  currencySymbol,
}: SatisfactionByCategoryProps) => {
  const { bestBuys, regrets, allCategories } = useMemo(() => {
    const categoryStats: Record<string, CategorySatisfaction> = {};

    expenses.forEach((expense) => {
      const category = expense.category.name;
      const satisfaction = expense.satisfaction || 3;

      if (!categoryStats[category]) {
        categoryStats[category] = {
          category,
          avgSatisfaction: 0,
          totalSpent: 0,
          count: 0,
        };
      }

      categoryStats[category].totalSpent += expense.amount;
      categoryStats[category].avgSatisfaction += satisfaction;
      categoryStats[category].count++;
    });

    // Calculate averages
    Object.values(categoryStats).forEach((cat) => {
      cat.avgSatisfaction = cat.count > 0 ? cat.avgSatisfaction / cat.count : 0;
    });

    const sortedCategories = Object.values(categoryStats).sort(
      (a, b) => b.avgSatisfaction - a.avgSatisfaction
    );

    // Best buys: satisfaction >= 4
    const bestBuys = sortedCategories.filter((cat) => cat.avgSatisfaction >= 4);

    // Regrets: satisfaction < 3
    const regrets = sortedCategories.filter((cat) => cat.avgSatisfaction < 3);

    return { bestBuys, regrets, allCategories: sortedCategories };
  }, [expenses]);

  const getSatisfactionColor = (satisfaction: number) => {
    if (satisfaction >= 4) return "text-green-500";
    if (satisfaction >= 3) return "text-yellow-500";
    return "text-red-500";
  };

  const getSatisfactionBgColor = (satisfaction: number) => {
    if (satisfaction >= 4) return "bg-green-50";
    if (satisfaction >= 3) return "bg-yellow-50";
    return "bg-red-50";
  };

  const renderStars = (satisfaction: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= satisfaction ? getSatisfactionColor(satisfaction) : "text-gray-300"
            }`}
            fill={star <= satisfaction ? "currentColor" : "none"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
      <h2 className="text-lg font-bold text-gray-700 mb-4">
        {dict.psychologyPage?.satisfactionByCategory || "Satisfaction by Category"}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Buys */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ThumbsUp className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-gray-700">
              {dict.psychologyPage?.bestBuys || "Best Buys"} (4+/5)
            </h3>
          </div>
          {bestBuys.length > 0 ? (
            <div className="space-y-2">
              {bestBuys.map((cat) => (
                <div
                  key={cat.category}
                  className={`p-3 rounded-lg ${getSatisfactionBgColor(cat.avgSatisfaction)}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-800">{cat.category}</div>
                      <div className="text-sm text-gray-500">
                        {currencySymbol}{cat.totalSpent.toFixed(0)} ({cat.count} purchases)
                      </div>
                    </div>
                    <div className="text-right">
                      {renderStars(Math.round(cat.avgSatisfaction))}
                      <div className={`text-sm font-semibold ${getSatisfactionColor(cat.avgSatisfaction)}`}>
                        {cat.avgSatisfaction.toFixed(1)}/5
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-sm p-3 bg-gray-50 rounded-lg">
              {dict.psychologyPage?.noBestBuys || "No high-satisfaction categories yet"}
            </div>
          )}
        </div>

        {/* Regrets */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ThumbsDown className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-gray-700">
              {dict.psychologyPage?.regrets || "Regrets"} (&lt;3/5)
            </h3>
          </div>
          {regrets.length > 0 ? (
            <div className="space-y-2">
              {regrets.map((cat) => (
                <div
                  key={cat.category}
                  className={`p-3 rounded-lg ${getSatisfactionBgColor(cat.avgSatisfaction)}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-800">{cat.category}</div>
                      <div className="text-sm text-gray-500">
                        {currencySymbol}{cat.totalSpent.toFixed(0)} ({cat.count} purchases)
                      </div>
                    </div>
                    <div className="text-right">
                      {renderStars(Math.round(cat.avgSatisfaction))}
                      <div className={`text-sm font-semibold ${getSatisfactionColor(cat.avgSatisfaction)}`}>
                        {cat.avgSatisfaction.toFixed(1)}/5
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-sm p-3 bg-gray-50 rounded-lg">
              {dict.psychologyPage?.noRegrets || "No low-satisfaction categories - great job!"}
            </div>
          )}
        </div>
      </div>

      {/* All Categories */}
      <div className="mt-6">
        <h3 className="font-semibold text-gray-700 mb-3">
          {dict.psychologyPage?.allCategories || "All Categories"}
        </h3>
        <div className="space-y-2">
          {allCategories.map((cat) => (
            <div
              key={cat.category}
              className="flex items-center justify-between p-2 border-b border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="font-medium text-gray-700">{cat.category}</div>
                <span className="text-sm text-gray-400">
                  {cat.count} {cat.count === 1 ? "purchase" : "purchases"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {currencySymbol}{cat.totalSpent.toFixed(0)}
                </span>
                <span className={`font-semibold ${getSatisfactionColor(cat.avgSatisfaction)}`}>
                  {cat.avgSatisfaction.toFixed(1)}/5
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
