"use client";

import { Expense } from "@/src/types";
import { AppDictionary } from "@/src/translations";
import { useContext, useMemo } from "react";
import { AppContext } from "@/src/app-wrappper/provider";
import { DashboardContext } from "./provider";
import { Button } from "../../components";
import clsx from "clsx";
import { format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { abbreviateCurrency } from "@/src/helpers/abbreviate-currency";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

export type ExpensesByDayGraphProps = {
  expenses: Expense[];
  dict: AppDictionary;
};

export const getDailyTotalsByCategory = (expenses: Expense[]) => {
  const totalsByDayAndCategory: { [key: string]: { [key: string]: number } } =
    {};
  const totalsByDay: { [key: string]: number } = {};

  const dates = expenses.map((expense) => new Date(expense.date));
  if (dates.length === 0) return [];

  const startDate = new Date(Math.min(...dates.map((d) => d.getTime())));
  const endDate = new Date(Math.max(...dates.map((d) => d.getTime())));

  const allDays: string[] = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    allDays.push(d.toISOString().split("T")[0]);
  }

  expenses.forEach((expense) => {
    const day = expense.date?.toISOString().split("T")[0] || "";
    const category = expense.category.name;

    if (!totalsByDayAndCategory[day]) {
      totalsByDayAndCategory[day] = {};
    }
    if (!totalsByDayAndCategory[day][category]) {
      totalsByDayAndCategory[day][category] = 0;
    }
    totalsByDayAndCategory[day][category] += expense.amount;

    if (!totalsByDay[day]) {
      totalsByDay[day] = 0;
    }
    totalsByDay[day] += expense.amount;
  });

  const uniqueCategories = [
    ...new Set(expenses.map((expense) => expense.category.name)),
  ];

  allDays.forEach((day) => {
    if (!totalsByDayAndCategory[day]) {
      totalsByDayAndCategory[day] = {};
    }
    uniqueCategories.forEach((category) => {
      if (!totalsByDayAndCategory[day][category]) {
        totalsByDayAndCategory[day][category] = 0;
      }
    });
    if (!totalsByDay[day]) {
      totalsByDay[day] = 0;
    }
  });

  return allDays.map((day) => ({
    day: format(new Date(day + "T00:00:00"), "EEE dd"),
    ...totalsByDayAndCategory[day],
    total: totalsByDay[day],
  }));
};

export const ExpensesByDayGraph = ({
  expenses,
  dict,
}: ExpensesByDayGraphProps) => {
  const { currency, subscriptionDetails } = useContext(AppContext);
  const { selectedCategories } = useContext(DashboardContext);

  const isPremium = subscriptionDetails?.isPremium;

  const filteredExpenses = useMemo(
    () =>
      expenses.filter((expense) =>
        selectedCategories.includes(expense.category.id)
      ),
    [expenses, selectedCategories]
  );

  const data = getDailyTotalsByCategory(filteredExpenses);

  const categoryDetails = useMemo(
    () =>
      Array.from(
        new Set(filteredExpenses.map((expense) => expense.category.name))
      ).map((categoryName) => {
        const categoryExpense = filteredExpenses.find(
          (e) => e.category.name === categoryName
        );
        return {
          name: categoryName,
          color: categoryExpense?.category.color || "#000000",
        };
      }),
    [filteredExpenses]
  );

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {
      total: {
        label: dict.dashboard.totalExpenses,
        color: "#ef4444",
      },
    };
    categoryDetails.forEach((cat) => {
      config[cat.name] = {
        label: cat.name,
        color: cat.color,
      };
    });
    return config;
  }, [categoryDetails, dict.dashboard.totalExpenses]);

  if (selectedCategories.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-sm shadow-sm">
        <p className="text-gray-500 mb-2">
          {dict.dashboard.noSelectedCategories}
        </p>
        <p className="text-sm text-gray-400">
          {dict.dashboard.selectCategoryToViewRecords}
        </p>
      </div>
    );
  }

  if (filteredExpenses.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-sm shadow-sm">
        <p className="text-gray-500 mb-2">
          {dict.dashboard.noRecordsForSelectedCategories}
        </p>
        <p className="text-sm text-gray-400">
          {dict.dashboard.trySelectingDifferentCategories}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="font-bold mb-5 text-gray-600 uppercase">
        {dict.dashboard.totalExpensesPerDayByCategory}
      </div>
      <div className="p-5 rounded-sm shadow-sm bg-white relative">
        {!isPremium && (
          <>
            <div
              className="bg-black inset-0 absolute blur-sm rounded-md z-[1000]"
              style={{ opacity: "5%" }}
            />
            <div className="inset-0 absolute flex items-center justify-center p-5 z-[10001]">
              <div className="w-full p-5 rounded-md border border-gray-200 border-solid bg-white max-w-[350px]">
                <div className="text-lg font-bold mb-3">
                  {dict.shared?.subscriptionMessages?.seeTotalExpensesPerDayTitle}
                </div>
                <div className="mb-3">
                  {dict.shared?.subscriptionMessages?.seeTotalExpensesPerDayMessage}
                </div>
                {subscriptionDetails?.isUserOnStripe ? (
                  <Button
                    href={subscriptionDetails.stripeCustomerPortalLink}
                    target="_blank"
                    className="text-white bg-black"
                  >
                    {dict.shared?.manageSubscription}
                  </Button>
                ) : (
                  <Button href="/dashboard/pricing" className="text-white bg-black">
                    {dict.shared?.goPremium}
                  </Button>
                )}
              </div>
            </div>
          </>
        )}

        <div className={clsx({ "blur-sm p-5": !isPremium })}>
          <ChartContainer config={chartConfig} className="h-[450px] w-full">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="day" className="text-xs" />
              <YAxis
                tickFormatter={(value) => abbreviateCurrency(value, currency.symbol)}
                className="text-xs"
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => (
                      <span>
                        {chartConfig[name as string]?.label || name}: {currency.symbol}
                        {Number(value).toFixed(2)}
                      </span>
                    )}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              {categoryDetails.map((cat) => (
                <Line
                  key={cat.name}
                  type="monotone"
                  dataKey={cat.name}
                  stroke={`var(--color-${cat.name})`}
                  strokeWidth={2}
                  dot={{ fill: cat.color, r: 3 }}
                />
              ))}
              <Line
                type="monotone"
                dataKey="total"
                name={dict.dashboard.totalExpenses}
                stroke="var(--color-total)"
                strokeWidth={2}
                dot={{ fill: "#ef4444", r: 3 }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </div>
    </>
  );
};
