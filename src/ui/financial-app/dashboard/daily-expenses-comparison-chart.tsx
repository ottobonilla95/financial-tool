"use client";

import { useContext, useId, useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { AppContext } from "@/src/app-wrappper/provider";
import { abbreviateCurrency } from "@/src/helpers/abbreviate-currency";
import { formatCurrency } from "@/src/helpers/format-currency";
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
  const [showFullMonth, setShowFullMonth] = useState(false);
  const chartId = useId();
  const daysInMonth = new Date(
    Date.UTC(selectedYear, selectedMonth, 0)
  ).getUTCDate();
  const canExpand = comparisonDayCount < daysInMonth;
  const isExpanded = canExpand && showFullMonth;
  const displayedDayCount = isExpanded ? daysInMonth : comparisonDayCount;
  const { currency } = useContext(AppContext);
  const { selectedCategories } = useContext(DashboardContext);
  const selectedCategoryIds = useMemo(
    () => new Set(selectedCategories),
    [selectedCategories]
  );
  const hasCategoryFilter =
    currentExpenses.some(
      (expense) => !selectedCategoryIds.has(expense.category.id)
    ) ||
    previousExpenses.some(
      (expense) => !selectedCategoryIds.has(expense.category.id)
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
        displayedDayCount
      ),
    [filteredCurrentExpenses, filteredPreviousExpenses, displayedDayCount]
  );

  // Keep the totals on the same elapsed period even when the chart is expanded.
  const periodTotals = useMemo(
    () =>
      data.reduce(
        (totals, day) => {
          if (day.day <= comparisonDayCount) {
            totals.current += day.current;
            totals.previous += day.previous;
          }
          return totals;
        },
        { current: 0, previous: 0 }
      ),
    [data, comparisonDayCount]
  );
  const largestTotal = Math.max(periodTotals.current, periodTotals.previous);
  const changeRatio =
    periodTotals.previous === 0
      ? periodTotals.current === 0
        ? 0
        : null
      : (periodTotals.current - periodTotals.previous) / periodTotals.previous;
  const formattedChange =
    changeRatio === null
      ? "—"
      : new Intl.NumberFormat(lang, {
          style: "percent",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
          signDisplay: "exceptZero",
        }).format(changeRatio);

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
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="font-bold mb-2 text-gray-600 uppercase">
            {dict.dashboard.dailyExpensesComparison}
          </div>
          <p className="text-sm text-gray-500">
            {dict.dashboard.comparingThroughDay.replace(
              "{day}",
              String(displayedDayCount)
            )}
            {isExpanded && ` ${dict.dashboard.futureDaysShownAsZero}`}
          </p>
        </div>
        {canExpand && (
          <button
            type="button"
            aria-expanded={isExpanded}
            aria-controls={chartId}
            onClick={() => setShowFullMonth((expanded) => !expanded)}
            className="self-start shrink-0 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {isExpanded
              ? dict.dashboard.showThroughToday
              : dict.dashboard.showFullMonth}
          </button>
        )}
      </div>

      <div id={chartId} className="p-5 rounded-sm shadow-sm bg-white">
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

        <div className="mt-6 border-t border-gray-100 pt-5">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-600">
              {dict.dashboard.totalSpendingThroughDay.replace(
                "{day}",
                String(comparisonDayCount)
              )}
            </h3>
            {hasCategoryFilter && (
              <p className="mt-1 text-xs text-gray-500">
                {dict.dashboard.selectedCategoriesComparison}
              </p>
            )}
          </div>
          <dl className="grid gap-6 sm:grid-cols-3">
            {(["current", "previous"] as const).map((period) => (
              <div key={period} className="min-w-0">
                <dt className="text-sm text-gray-500">
                  {chartConfig[period].label}
                </dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums text-gray-700">
                  {formatCurrency(periodTotals[period], currency)}
                </dd>
                <div
                  aria-hidden="true"
                  className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100"
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: chartConfig[period].color,
                      width: `${largestTotal > 0 ? (periodTotals[period] / largestTotal) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
            <div className="min-w-0">
              <dt className="text-sm text-gray-500">
                {dict.dashboard.percentageChange}
              </dt>
              <dd
                className={`mt-1 text-2xl font-semibold tabular-nums ${
                  changeRatio === null || changeRatio === 0
                    ? "text-gray-700"
                    : changeRatio > 0
                      ? "text-red-600"
                      : "text-emerald-600"
                }`}
              >
                {formattedChange}
              </dd>
              <dd className="mt-2 text-xs text-gray-500">
                {changeRatio === null
                  ? dict.dashboard.noPreviousPeriodSpending
                  : dict.dashboard.samePeriodLastMonth}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};
