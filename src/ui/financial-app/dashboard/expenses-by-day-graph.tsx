"use client";

import { Expense } from "@/src/types";
import { AppDictionary } from "@/src/translations";
import { AgChartProps, AgCharts } from "ag-charts-react";
import { abbreviateCurrency } from "@/src/helpers/abbreviate-currency";
import { useContext, useState } from "react";
import { AppContext } from "@/src/app-wrappper/provider";
import { Button } from "../../components";
import clsx from "clsx";

export type ExpensesByDayGraphProps = {
  expenses: Expense[];
  dict: AppDictionary;
};

export const getDailyTotalsByCategory = (expenses: Expense[]) => {
  const totalsByDayAndCategory: { [key: string]: { [key: string]: number } } =
    {};
  const totalsByDay: { [key: string]: number } = {};

  expenses.forEach((expense) => {
    const day = expense.date.toISOString().split("T")[0]; // Get YYYY-MM-DD format
    const category = expense.category.name;

    if (!totalsByDayAndCategory[day]) {
      totalsByDayAndCategory[day] = {};
    }

    if (!totalsByDayAndCategory[day][category]) {
      totalsByDayAndCategory[day][category] = 0;
    }

    totalsByDayAndCategory[day][category] += expense.amount;

    // Calculate the total expenses per day
    if (!totalsByDay[day]) {
      totalsByDay[day] = 0;
    }
    totalsByDay[day] += expense.amount;
  });

  // Format the result into an array of objects
  return Object.keys(totalsByDayAndCategory).map((day) => ({
    day,
    ...totalsByDayAndCategory[day],
    total: totalsByDay[day], // Add the total per day
  }));
};

export const ExpensesByDayGraph = ({
  expenses,
  dict,
}: ExpensesByDayGraphProps) => {
  const { currency, subscriptionDetails } = useContext(AppContext);

  const isPremium = subscriptionDetails?.isPremium;

  const data = getDailyTotalsByCategory(expenses);

  const categoryDetails = Array.from(
    new Set(expenses.map((expense) => expense.category.name))
  ).map((categoryName) => {
    const categoryExpense = expenses.find(
      (e) => e.category.name === categoryName
    );
    return {
      name: categoryName,
      color: categoryExpense?.category.color || "#000000", // Fallback to black if no color
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

  const [props] = useState<AgChartProps>({
    options: {
      data,
      series, // Correctly typed series array with the total added
      axes: [
        {
          type: "number", // Numerical values on the y-axis
          position: "left",
          label: {
            formatter: ({ value }) =>
              abbreviateCurrency(value, currency.symbol),
          },
          min: 0,
        },
        {
          type: "category", // Categorical values (days) on the x-axis
          position: "bottom",
        },
      ],
      height: 450,
      padding: {
        right: 0,
        left: 0,
      },
    },
  });

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
