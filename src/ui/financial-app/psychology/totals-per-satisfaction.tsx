"use client";

import React, { useState } from "react";
import { AgCharts, AgChartProps } from "ag-charts-react";
import { Expense } from "@/src/types";
import {
  getAllUniqueMonths,
  groupExpensesBySatisfactionWithPercentages, // new function for satisfaction
} from "./helpers";
import { AppDictionary } from "@/src/translations";

export type SatisfactionSpendingGraphProps = {
  expenses: Expense[];
  dict: AppDictionary;
};

export const SatisfactionSpendingPatternsGraph = ({
  expenses,
  dict,
}: SatisfactionSpendingGraphProps) => {
  const satisfactionColors = {
    [dict.shared.satisfactionLevels.veryUnsatisfied]: "#dc2626", // Dark Red for Very Unsatisfied
    [dict.shared.satisfactionLevels.unsatisfied]: "#f87171", // Light Red for Unsatisfied
    [dict.shared.satisfactionLevels.neutral]: "#a3a3a3", // Gray for Neutral
    [dict.shared.satisfactionLevels.satisfied]: "#4ade80", // Light Green for Satisfied
    [dict.shared.satisfactionLevels.verySatisfied]: "#16a34a", // Dark Green for Very Satisfied
  };

  const allMonths = getAllUniqueMonths(expenses);
  const groupedExpenses = groupExpensesBySatisfactionWithPercentages(
    expenses,
    allMonths,
    dict
  );

  const [props] = useState<AgChartProps>({
    options: {
      title: {
        text: dict.psychologyPage.satisfactionSpendingPatterns,
        color: "#6b7280",
        fontSize: 18,
        fontFamily: "Roboto",
      },
      data: allMonths.map((month) => {
        const entry: Record<string, any> = { monthYear: month };
        Object.entries(groupedExpenses).forEach(([satisfaction, data]) => {
          entry[satisfaction] = data[month] || 0;
        });
        return entry;
      }),
      series: Object.keys(groupedExpenses).map((satisfaction) => ({
        type: "line",
        xKey: "monthYear",
        xName: "Month",
        yKey: satisfaction,
        yName: `${satisfaction}`,
        interpolation: { type: "linear" },
        stroke: satisfactionColors[satisfaction] || "gray", // Get color by translated label or default to gray
        marker: {
          fill: satisfactionColors[satisfaction] || "gray",
          stroke: satisfactionColors[satisfaction] || "gray",
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
