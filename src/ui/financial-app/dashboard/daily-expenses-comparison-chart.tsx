"use client";

import { useContext, useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { AppContext } from "@/src/app-wrappper/provider";
import { abbreviateCurrency } from "@/src/helpers/abbreviate-currency";
import { AppDictionary, AvailableLanguages } from "@/src/translations";
import { Expense } from "@/src/types";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { DashboardContext } from "./provider";

type DailyExpensesComparisonChartProps = {
  currentExpenses: Expense[];
  previousExpenses: Expense[];
  selectedMonth: number;
  selectedYear: number;
  comparisonDayCount: number;
  dict: AppDictionary;
  lang: AvailableLanguages;
};

const getTotalsByDay = (expenses: Expense[]) =>
  expenses.reduce<Record<number, number>>((totals, expense) => {
    const day = expense.date.getUTCDate();
    totals[day] = (totals[day] || 0) + expense.amount;
    return totals;
  }, {});

export const getDailyExpensesComparison = (
  currentExpenses: Expense[],
  previousExpenses: Expense[],
  dayCount: number
) => {
  const currentTotals = getTotalsByDay(currentExpenses);
  const previousTotals = getTotalsByDay(previousExpenses);

  return Array.from({ length: dayCount }, (_, index) => {
    const day = index + 1;

    return {
      day,
      current: currentTotals[day] || 0,
      previous: previousTotals[day] || 0,
    };
  });
};

export const DailyExpensesComparisonChart = ({
  currentExpenses,
  previousExpenses,
  selectedMonth,
  selectedYear,
  comparisonDayCount,
  dict,
  lang,
}: DailyExpensesComparisonChartProps) => {
  const { currency } = useContext(AppContext);
  const { selectedCategories } = useContext(DashboardContext);
  const selectedCategoryIds = useMemo(
    () => new Set(selectedCategories),
    [selectedCategories]
  );

  const filteredCurrentExpenses = useMemo(
    () =>
      currentExpenses.filter((expense) =>
        selectedCategoryIds.has(expense.category.id)
      ),
    [currentExpenses, selectedCategoryIds]
  );

  const filteredPreviousExpenses = useMemo(
    () =>
      previousExpenses.filter((expense) =>
        selectedCategoryIds.has(expense.category.id)
      ),
    [previousExpenses, selectedCategoryIds]
  );

  const data = useMemo(
    () =>
      getDailyExpensesComparison(
        filteredCurrentExpenses,
        filteredPreviousExpenses,
        comparisonDayCount
      ),
    [filteredCurrentExpenses, filteredPreviousExpenses, comparisonDayCount]
  );

  const chartConfig = useMemo(() => {
    const monthFormatter = new Intl.DateTimeFormat(lang, {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });

    return {
      current: {
        label: monthFormatter.format(
          new Date(Date.UTC(selectedYear, selectedMonth - 1, 1))
        ),
        color: "#2563eb",
      },
      previous: {
        label: monthFormatter.format(
          new Date(Date.UTC(selectedYear, selectedMonth - 2, 1))
        ),
        color: "#94a3b8",
      },
    } satisfies ChartConfig;
  }, [lang, selectedMonth, selectedYear]);

  if (selectedCategories.length === 0) return null;

  return (
    <div>
      <div className="font-bold mb-2 text-gray-600 uppercase">
        {dict.dashboard.dailyExpensesComparison}
      </div>
      <p className="mb-5 text-sm text-gray-500">
        {dict.dashboard.comparingThroughDay.replace(
          "{day}",
          String(comparisonDayCount)
        )}
      </p>

      <div className="p-5 rounded-sm shadow-sm bg-white">
        <ChartContainer config={chartConfig} className="h-[360px] w-full">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="day"
              label={{
                value: dict.dashboard.day,
                position: "insideBottomRight",
                offset: -5,
              }}
              className="text-xs"
            />
            <YAxis
              tickFormatter={(value) =>
                abbreviateCurrency(value, currency.symbol)
              }
              className="text-xs"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(day) => `${dict.dashboard.day} ${day}`}
                  formatter={(value, name) => (
                    <span>
                      {chartConfig[name as keyof typeof chartConfig]?.label ||
                        name}
                      : {currency.symbol}
                      {Number(value).toFixed(2)}
                    </span>
                  )}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              type="monotone"
              dataKey="current"
              stroke="var(--color-current)"
              strokeWidth={3}
              dot={{ fill: chartConfig.current.color, r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="previous"
              stroke="var(--color-previous)"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={{ fill: chartConfig.previous.color, r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
};
