"use client";

import { Expense } from "@/src/types";
import { AppDictionary } from "@/src/translations";
import { AgChartProps, AgCharts } from "ag-charts-react";
import { abbreviateCurrency } from "@/src/helpers/abbreviate-currency";
import { useContext, useState } from "react";
import { AppContext } from "@/src/app-wrappper/provider";

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
  const { currency } = useContext(AppContext);

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
      title: {
        text: dict.dashboard.totalExpensesPerDayByCategory,
        color: "#6b7280",
        fontSize: 18,
        fontFamily: "Roboto",
      },
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
    <div className="p-5 rounded-sm shadow-sm bg-white">
      <AgCharts options={props.options} />
    </div>
  );
};
