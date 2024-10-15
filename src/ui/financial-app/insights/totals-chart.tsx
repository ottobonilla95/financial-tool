"use client";

import React, { useState } from "react";
import { AgCharts, AgChartProps } from "ag-charts-react";
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
import { roboto } from "@/src/styles/fonts";
import { capitalizeFirstLetter } from "@/src/helpers/capitalize-first-letter";

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

  const [props] = useState<AgChartProps>({
    options: {
      title: {
        text: dict.insights.totalIncomeExpensesSavings,
        color: "#6b7280",
        fontSize: 18,
        fontFamily: "Roboto",
      },
      data,
      series: [
        {
          type: "line",
          xKey: "monthYear",
          xName: "Mes",
          yKey: "expenses",
          yName: dict.shared.expenses,
          interpolation: { type: "linear" },
          stroke: "red",
          marker: {
            fill: "red",
            stroke: "red",
          },
        },
        {
          type: "line",
          xKey: "monthYear",
          xName: "Mes",
          yKey: "earnings",
          yName: dict.shared.income,
          interpolation: { type: "linear" },
          stroke: "green",
          marker: {
            fill: "green",
            stroke: "green",
          },
        },
        {
          type: "line",
          xKey: "monthYear",
          xName: "Mes",
          yKey: "savings",
          yName: dict.shared.savings,
          interpolation: { type: "linear" },
          stroke: "#f7d84a",
          marker: {
            fill: "#f7d84a",
            stroke: "#f7d84a",
          },
        },
      ],
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
  });

  return (
    <>
      {/* main chart */}
      {/* <div className="font-bold text-2xl">Total (Ingresos, Gastos, Ahorro)</div> */}
      <div className="p-5 rounded-sm shadow-sm bg-white">
        <AgCharts options={props.options} />
      </div>
      <div className="font-bold text-gray-600 text-lg my-6 uppercase">
        {dict.insights.expensesByCategory}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* categories charts */}
        {Object.keys(groupedExpenses).map((categoryName) => {
          const data = getChartDataForCategory(groupedExpenses, categoryName);

          // Prepare the series for the category and each subcategory, assigning a unique color for each
          const series = [
            {
              type: "line",
              xKey: "monthYear",
              xName: "Mes",
              yKey: "category",
              yName: categoryName,
              interpolation: { type: "linear" },
              stroke: "red", // Main category line in black
              marker: {
                fill: "red",
                stroke: "red",
              },
            },
            ...Object.keys(groupedExpenses[categoryName].subcategories).map(
              (subcategory, index) => ({
                type: "line",
                xKey: "monthYear",
                xName: "Mes",
                yKey: subcategory,
                yName: subcategory,
                interpolation: { type: "linear" },
                stroke: colors[index % colors.length],
                marker: {
                  fill: colors[index % colors.length],
                  stroke: colors[index % colors.length],
                },
              })
            ),
          ];

          return (
            <div
              key={categoryName}
              className="p-5 rounded-sm shadow-sm bg-white w-full "
            >
              <AgCharts
                options={
                  {
                    title: {
                      text: capitalizeFirstLetter(`${categoryName}`),
                      color: "#6b7280",
                      fontFamily: "Roboto",
                    },
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
                  } as AgChartProps["options"]
                }
              />
            </div>
          );
        })}
      </div>
    </>
  );
};
