"use client";

import React, { useState } from "react";
import { AgCharts, AgChartProps } from "ag-charts-react";
import { Expense } from "@/src/types";
import {
  emotionColors,
  getAllUniqueMonths,
  groupExpensesByEmotionWithPercentages,
} from "./helpers";
import { AppDictionary } from "@/src/translations";

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

  const [props] = useState<AgChartProps>({
    options: {
      title: {
        text: dict.psychologyPage.emotionalSpendingPatterns,
        color: "#6b7280",
        fontSize: 18,
        fontFamily: "Roboto",
      },
      data: allMonths.map((month) => {
        const entry: Record<string, any> = { monthYear: month };
        Object.entries(groupedExpenses).forEach(([emotion, data]) => {
          entry[emotion] = data[month] || 0;
        });
        return entry;
      }),
      series: Object.keys(groupedExpenses).map((emotion) => ({
        type: "line",
        xKey: "monthYear",
        xName: "Month",
        yKey: emotion,
        yName:
          dict.forms.expense.create[
            emotion as keyof typeof dict.forms.expense.create
          ],
        interpolation: { type: "linear" },
        stroke:
          emotionColors[emotion.toLowerCase() as keyof typeof emotionColors] ||
          "gray", // Use the color or default to gray
        marker: {
          fill:
            emotionColors[
              emotion.toLowerCase() as keyof typeof emotionColors
            ] || "gray",
          stroke:
            emotionColors[
              emotion.toLowerCase() as keyof typeof emotionColors
            ] || "gray",
        },
      })),
      axes: [
        {
          type: "number",
          position: "left",
          title: { text: "Spending (%)" },
          label: {
            formatter: ({ value }) => `${value.toFixed(1)}%`,
          },
          min: 0,
          max: 100,
        },
        {
          type: "category",
          position: "bottom",
          title: { text: "Month" },
        },
      ],
      height: 550,
      padding: {
        right: 0,
        left: 0,
      },
    },
  });

  return (
    <div className="p-5 rounded-sm shadow-sm bg-white">
      <AgCharts options={props.options} />
    </div>
  );
};
