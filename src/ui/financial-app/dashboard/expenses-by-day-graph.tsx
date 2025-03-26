"use client";

import { Expense } from "@/src/types";
import { AppDictionary } from "@/src/translations";
import { AgChartProps, AgCharts } from "ag-charts-react";
import { abbreviateCurrency } from "@/src/helpers/abbreviate-currency";
import { useContext, useMemo } from "react";
import { AppContext } from "@/src/app-wrappper/provider";
import { DashboardContext } from "./provider";
import { Button } from "../../components";
import clsx from "clsx";
import { format } from "date-fns";

export type ExpensesByDayGraphProps = {
  expenses: Expense[];
  dict: AppDictionary;
};

export const getDailyTotalsByCategory = (expenses: Expense[]) => {
  const totalsByDayAndCategory: { [key: string]: { [key: string]: number } } =
    {};
  const totalsByDay: { [key: string]: number } = {};

  // Find the earliest and latest date in expenses
  const dates = expenses.map((expense) => new Date(expense.date));
  const startDate = new Date(Math.min(...dates.map((d) => d.getTime())));
  const endDate = new Date(Math.max(...dates.map((d) => d.getTime())));

  // Generate all dates within the range
  const allDays: string[] = [];
  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    allDays.push(d.toISOString().split("T")[0]); // Format YYYY-MM-DD
  }

  // Populate totals for existing expenses
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

  // Fill missing days with zeroes
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

  // Format the result into an array of objects
  return allDays.map((day) => ({
    // day,
    day: format(new Date(day + "T00:00:00"), "EEE dd"), //
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

  // Filter expenses based on selected categories
  const filteredExpenses = expenses.filter(expense => 
    selectedCategories.includes(expense.category.id)
  );

  const data = getDailyTotalsByCategory(filteredExpenses);

  // Use filtered expenses for category details
  const categoryDetails = Array.from(
    new Set(filteredExpenses.map((expense) => expense.category.name))
  ).map((categoryName) => {
    const categoryExpense = filteredExpenses.find(
      (e) => e.category.name === categoryName
    );
    return {
      name: categoryName,
      color: categoryExpense?.category.color || "#000000",
    };
  });
  const series: AgChartProps["options"]["series"] = categoryDetails.map(
    (categoryDetail) => ({
      type: "line",
      xKey: "day",
      xName: "Day",
      yKey: categoryDetail.name,
      yName: categoryDetail.name,
      interpolation: { type: "linear" },
      stroke: categoryDetail.color,
      marker: {
        fill: categoryDetail.color,
        stroke: categoryDetail.color,
      },
    })
  );

  series.push({
    type: "line",
    xKey: "day",
    xName: "Day",
    yKey: "total",
    yName: dict.dashboard.totalExpenses,
    interpolation: { type: "linear" },
    stroke: "red",
    marker: {
      fill: "red",
      stroke: "red",
    },
  });

  const props = useMemo<AgChartProps>(() => {
    return {
      options: {
        data,
        series,
        axes: [
          {
            type: "number",
            position: "left",
            label: {
              formatter: ({ value }) =>
                abbreviateCurrency(value, currency.symbol),
            },
            min: 0,
          },
          {
            type: "category",
            position: "bottom",
          },
        ],
        height: 450,
        padding: {
          right: 0,
          left: 0,
        },
      },
    };
  }, [data, series, currency, selectedCategories]);

  // Add empty state for when no categories are selected
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

  // Add empty state for when there are no records for selected categories
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
                <div className="text-lg font-bold  mb-3">
                  {
                    dict.shared?.subscriptionMessages
                      .seeTotalExpensesPerDayTitle
                  }
                </div>
                <div className=" mb-3">
                  {
                    dict.shared?.subscriptionMessages
                      .seeTotalExpensesPerDayMessage
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
          <AgCharts options={props.options} />
        </div>
      </div>
    </>
  );
};
