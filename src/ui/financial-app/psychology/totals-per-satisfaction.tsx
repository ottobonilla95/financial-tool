"use client";

import React, { useMemo } from "react";
import { Expense } from "@/src/types";
import {
  getAllUniqueMonths,
  groupExpensesBySatisfactionWithPercentages,
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

export type SatisfactionSpendingGraphProps = {
  expenses: Expense[];
  dict: AppDictionary;
};

export const SatisfactionSpendingPatternsGraph = ({
  expenses,
  dict,
}: SatisfactionSpendingGraphProps) => {
  const satisfactionColors: Record<string, string> = {
    [dict.shared.satisfactionLevels.veryUnsatisfied]: "#dc2626",
    [dict.shared.satisfactionLevels.unsatisfied]: "#f87171",
    [dict.shared.satisfactionLevels.neutral]: "#a3a3a3",
    [dict.shared.satisfactionLevels.satisfied]: "#4ade80",
    [dict.shared.satisfactionLevels.verySatisfied]: "#16a34a",
  };

  const allMonths = getAllUniqueMonths(expenses);
  const groupedExpenses = groupExpensesBySatisfactionWithPercentages(
    expenses,
    allMonths,
    dict
  );

  const data = useMemo(() => {
    return allMonths.map((month) => {
      const entry: Record<string, any> = { monthYear: month };
      Object.entries(groupedExpenses).forEach(([satisfaction, satData]) => {
        entry[satisfaction] = satData[month] || 0;
      });
      return entry;
    });
  }, [allMonths, groupedExpenses]);

  const satisfactionLevels = useMemo(() => {
    return Object.keys(groupedExpenses).map((satisfaction) => ({
      satisfaction,
      color: satisfactionColors[satisfaction] || "#6b7280",
    }));
  }, [groupedExpenses, satisfactionColors]);

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    satisfactionLevels.forEach(({ satisfaction, color }) => {
      config[satisfaction] = {
        label: satisfaction,
        color: color,
      };
    });
    return config;
  }, [satisfactionLevels]);

  return (
    <div className="p-5 rounded-sm shadow-sm bg-white">
      <h3 className="text-lg font-medium text-gray-500 mb-4">
        {dict.psychologyPage.satisfactionSpendingPatterns}
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
          {satisfactionLevels.map(({ satisfaction, color }) => (
            <Line
              key={satisfaction}
              type="monotone"
              dataKey={satisfaction}
              name={satisfaction}
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
