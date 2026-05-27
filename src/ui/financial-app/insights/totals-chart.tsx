"use client";

import React, { useContext, useMemo, useState } from "react";
import { Expense, Earning, Saving, Currency } from "@/src/types";
import {
  colors,
  getAllUniqueMonths,
  getChartDataForCategory,
  getMonthlyTotals,
  groupExpensesByCategoryWithAllMonths,
} from "./helpers";
import { AppDictionary } from "@/src/translations";
import { abbreviateCurrency } from "@/src/helpers/abbreviate-currency";
import { capitalizeFirstLetter } from "@/src/helpers/capitalize-first-letter";
import { Button } from "../../components";
import { AppContext } from "@/src/app-wrappper/provider";
import clsx from "clsx";
import { useBreakpoint } from "@/src/hooks";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

export type PieChartProps = {
  expenses: Expense[];
  earnings: Earning[];
  savings: Saving[];
  currency: Currency;
  dict: AppDictionary;
};

type InsightsRangeValue = "3" | "6" | "9" | "12" | "24" | "all";
type DatedRecord = { date: Date };

function filterRecordsByRange<T extends DatedRecord>(
  records: T[],
  range: InsightsRangeValue,
) {
  if (range === "all") return records;

  const now = new Date();
  const startDate = new Date(
    now.getFullYear(),
    now.getMonth() - Number(range) + 1,
    1,
  );
  const endDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999,
  );

  return records.filter((record) => {
    const date = new Date(record.date);
    return date >= startDate && date <= endDate;
  });
}

export const TotalLineChart = ({
  expenses,
  earnings,
  savings,
  currency,
  dict,
}: PieChartProps) => {
  const [selectedRange, setSelectedRange] = useState<InsightsRangeValue>("all");

  const rangeOptions: { value: InsightsRangeValue; label: string }[] = [
    { value: "3", label: dict.insights.past3Months },
    { value: "6", label: dict.insights.past6Months },
    { value: "9", label: dict.insights.past9Months },
    { value: "12", label: dict.insights.past12Months },
    { value: "24", label: dict.insights.past24Months },
    { value: "all", label: dict.insights.allTime },
  ];

  const filteredExpenses = useMemo(
    () => filterRecordsByRange(expenses, selectedRange),
    [expenses, selectedRange],
  );
  const filteredEarnings = useMemo(
    () => filterRecordsByRange(earnings, selectedRange),
    [earnings, selectedRange],
  );
  const filteredSavings = useMemo(
    () => filterRecordsByRange(savings, selectedRange),
    [savings, selectedRange],
  );

  const data = useMemo(
    () => getMonthlyTotals(filteredExpenses, filteredEarnings, filteredSavings),
    [filteredExpenses, filteredEarnings, filteredSavings],
  );
  const allMonths = useMemo(
    () => getAllUniqueMonths(filteredExpenses),
    [filteredExpenses],
  );
  const groupedExpenses = useMemo(
    () => groupExpensesByCategoryWithAllMonths(filteredExpenses, allMonths),
    [filteredExpenses, allMonths],
  );

  const { subscriptionDetails } = useContext(AppContext);
  const isPremium = subscriptionDetails?.isPremium;

  const { isLg } = useBreakpoint("lg");
  const categoriesToRender = isPremium
    ? Object.keys(groupedExpenses)
    : isLg
      ? Object.keys(groupedExpenses).slice(0, 4)
      : Object.keys(groupedExpenses).slice(0, 2);

  const formatCurrency = (value: number) =>
    abbreviateCurrency(value, currency?.symbol || "$");

  const mainChartConfig: ChartConfig = {
    expenses: {
      label: dict.shared.expenses,
      color: "#ef4444",
    },
    earnings: {
      label: dict.shared.income,
      color: "#22c55e",
    },
    savings: {
      label: dict.shared.savings,
      color: "#f7d84a",
    },
  };

  return (
    <>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-end">
        <label className="flex w-full flex-col gap-1 text-sm font-medium text-gray-600 sm:w-[220px]">
          {dict.insights.timeRange}
          <select
            value={selectedRange}
            onChange={(event) =>
              setSelectedRange(event.target.value as InsightsRangeValue)
            }
            className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black"
          >
            {rangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Main chart */}
      <div className="p-5 rounded-sm shadow-sm bg-white">
        <h3 className="text-lg font-medium text-gray-500 mb-4">
          {dict.insights.totalIncomeExpensesSavings}
        </h3>
        {data.length === 0 ? (
          <div className="flex h-[260px] items-center justify-center rounded-md border border-dashed border-gray-200 text-sm text-gray-500">
            {dict.insights.noRecordsForSelectedRange}
          </div>
        ) : (
          <ChartContainer config={mainChartConfig} className="h-[550px] w-full">
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
                tickFormatter={formatCurrency}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                tickLine={{ stroke: "#e5e7eb" }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => (
                      <span>
                        {mainChartConfig[name as string]?.label || name}:{" "}
                        {formatCurrency(Number(value))}
                      </span>
                    )}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                type="monotone"
                dataKey="expenses"
                name={dict.shared.expenses}
                stroke="var(--color-expenses)"
                strokeWidth={2}
                dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="earnings"
                name={dict.shared.income}
                stroke="var(--color-earnings)"
                strokeWidth={2}
                dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="savings"
                name={dict.shared.savings}
                stroke="var(--color-savings)"
                strokeWidth={2}
                dot={{ fill: "#f7d84a", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </div>

      <div className="relative mt-5">
        {!isPremium && (
          <>
            <div
              className="bg-black inset-0 absolute blur-sm rounded-md z-[1000]"
              style={{ opacity: "5%" }}
            />
            <div className="inset-0 absolute flex pt-10 items-center justify-center z-[10001]">
              <div className="w-full max-w-[400px] p-5 bg-white rounded-md border border-gray-200 border-solid">
                <div className="text-lg font-bold mb-3">
                  {
                    dict.shared?.subscriptionMessages
                      .seeExpensesPerMonthByCategoryTitle
                  }
                </div>
                <div className="mb-3">
                  {
                    dict.shared?.subscriptionMessages
                      .seeExpensesPerMonthByCategoryMessage
                  }
                </div>
                {subscriptionDetails?.isUserOnStripe ? (
                  <Button
                    href={subscriptionDetails.stripeCustomerPortalLink}
                    target="_blank"
                    className="text-white bg-black"
                  >
                    {`${dict.shared?.manageSubscription}`}
                  </Button>
                ) : (
                  <Button
                    href="/dashboard/pricing"
                    className="text-white bg-black"
                  >{`${dict.shared?.goPremium}`}</Button>
                )}
              </div>
            </div>
          </>
        )}

        <div
          className={clsx({
            "blur-sm p-5": !isPremium,
          })}
        >
          <div className="font-bold text-gray-600 text-lg my-6 uppercase">
            {dict.insights.expensesByCategory}
          </div>

          {categoriesToRender.length === 0 ? (
            <div className="flex h-[220px] items-center justify-center rounded-md border border-dashed border-gray-200 bg-white text-sm text-gray-500">
              {dict.insights.noExpensesForSelectedRange}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Categories charts */}
              {categoriesToRender.map((categoryName) => {
                const chartData = getChartDataForCategory(
                  groupedExpenses,
                  categoryName,
                );
                const subcategories = Object.keys(
                  groupedExpenses[categoryName].subcategories,
                );

                const categoryChartConfig: ChartConfig = {
                  category: {
                    label: categoryName,
                    color: "#ef4444",
                  },
                };
                subcategories.forEach((sub, index) => {
                  categoryChartConfig[sub] = {
                    label: sub,
                    color: colors[index % colors.length],
                  };
                });

                return (
                  <div
                    key={categoryName}
                    className="p-5 rounded-sm shadow-sm bg-white w-full"
                  >
                    <h4 className="text-lg font-medium text-gray-500 mb-4">
                      {capitalizeFirstLetter(categoryName)}
                    </h4>
                    <ChartContainer
                      config={categoryChartConfig}
                      className="h-[400px] w-full"
                    >
                      <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="stroke-muted"
                        />
                        <XAxis
                          dataKey="monthYear"
                          tick={{ fill: "#6b7280", fontSize: 12 }}
                          tickLine={{ stroke: "#e5e7eb" }}
                        />
                        <YAxis
                          tickFormatter={formatCurrency}
                          tick={{ fill: "#6b7280", fontSize: 12 }}
                          tickLine={{ stroke: "#e5e7eb" }}
                        />
                        <ChartTooltip
                          content={
                            <ChartTooltipContent
                              formatter={(value, name) => (
                                <span>
                                  {categoryChartConfig[name as string]?.label ||
                                    name}
                                  : {formatCurrency(Number(value))}
                                </span>
                              )}
                            />
                          }
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Line
                          type="monotone"
                          dataKey="category"
                          name={categoryName}
                          stroke="var(--color-category)"
                          strokeWidth={2}
                          dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        {subcategories.map((subcategory, index) => (
                          <Line
                            key={subcategory}
                            type="monotone"
                            dataKey={subcategory}
                            name={subcategory}
                            stroke={colors[index % colors.length]}
                            strokeWidth={2}
                            dot={{
                              fill: colors[index % colors.length],
                              strokeWidth: 2,
                              r: 4,
                            }}
                            activeDot={{ r: 6 }}
                          />
                        ))}
                      </LineChart>
                    </ChartContainer>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
