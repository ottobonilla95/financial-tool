"use client";

import React, { useContext, useMemo } from "react";
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

export const TotalLineChart = ({
  expenses,
  earnings,
  savings,
  currency,
  dict,
}: PieChartProps) => {
  const data = getMonthlyTotals(expenses, earnings, savings);
  const allMonths = getAllUniqueMonths(expenses);
  const groupedExpenses = groupExpensesByCategoryWithAllMonths(
    expenses,
    allMonths
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
      {/* Main chart */}
      <div className="p-5 rounded-sm shadow-sm bg-white">
        <h3 className="text-lg font-medium text-gray-500 mb-4">
          {dict.insights.totalIncomeExpensesSavings}
        </h3>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Categories charts */}
            {categoriesToRender.map((categoryName) => {
              const chartData = getChartDataForCategory(
                groupedExpenses,
                categoryName
              );
              const subcategories = Object.keys(
                groupedExpenses[categoryName].subcategories
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
        </div>
      </div>
    </>
  );
};
