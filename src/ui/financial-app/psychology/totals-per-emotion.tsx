"use client";

import React, { useMemo } from "react";
import { Expense } from "@/src/types";
import {
  getAllUniqueMonths,
  groupExpensesByEmotionWithPercentages,
} from "./helpers";
import { AppDictionary } from "@/src/translations";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

export type EmotionSpendingGraphProps = {
  expenses: Expense[];
  dict: AppDictionary;
};

export const EmotionSpendingPatternsGraph = ({
  expenses,
  dict,
}: EmotionSpendingGraphProps) => {
  const allMonths = getAllUniqueMonths(expenses);
  const groupedExpenses = groupExpensesByEmotionWithPercentages(
    expenses,
    allMonths
  );

  const data = useMemo(() => {
    return allMonths.map((month) => {
      const entry: Record<string, any> = { monthYear: month };
      Object.entries(groupedExpenses).forEach(([emotion, emotionData]) => {
        entry[emotion] = emotionData[month] || 0;
      });
      return entry;
    });
  }, [allMonths, groupedExpenses]);

  const emotionLines = useMemo(() => {
    return Object.keys(groupedExpenses).map((emotion) => {
      const emotionColor =
        expenses.find((expense) => expense.emotion?.name === emotion)?.emotion
          ?.color || "#6b7280";

      return {
        emotion,
        color: emotionColor,
        translatedName:
          dict.forms.expense.create[
            emotion as keyof typeof dict.forms.expense.create
          ] || emotion,
      };
    });
  }, [groupedExpenses, expenses, dict]);

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    emotionLines.forEach(({ emotion, color, translatedName }) => {
      config[emotion] = {
        label: translatedName,
        color: color,
      };
    });
    return config;
  }, [emotionLines]);

  return (
    <div className="p-5 rounded-sm shadow-sm bg-white">
      <h3 className="text-lg font-medium text-gray-500 mb-4">
        {dict.psychologyPage.emotionalSpendingPatterns}
      </h3>
      <ChartContainer config={chartConfig} className="h-[550px] w-full">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="monthYear"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            tickLine={{ stroke: "#e5e7eb" }}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            tickLine={{ stroke: "#e5e7eb" }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, name) => (
                  <span>
                    {chartConfig[name as string]?.label || name}:{" "}
                    {Number(value).toFixed(1)}%
                  </span>
                )}
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
          {emotionLines.map(({ emotion, color, translatedName }) => (
            <Line
              key={emotion}
              type="monotone"
              dataKey={emotion}
              name={translatedName}
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ChartContainer>
    </div>
  );
};
