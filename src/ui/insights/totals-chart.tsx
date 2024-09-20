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

export type PieChartProps = {
  expenses: Expense[];
  earnings: Earning[];
  savings: Saving[];
  currency: Currency;
};

export const TotalLineChart = ({
  expenses,
  earnings,
  savings,
  currency,
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
        text: "Total (Ingresos, Gastos, Ahorro)",
        fontSize: 20,
        fontWeight: "bold",
      },
      data,
      series: [
        {
          type: "line",
          xKey: "monthYear",
          xName: "Mes",
          yKey: "expenses",
          yName: "Gastos",
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
          yName: "Ingresos",
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
          yName: "Ahorros",
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
            formatter: ({ value }) => `${currency.symbol}${value.toFixed(2)}`,
          },
          min: 0,
        },
        {
          type: "category",
          position: "bottom",
        },
      ],
      height: 450,
    },
  });

  return (
    <>
      {/* main chart */}
      {/* <div className="font-bold text-2xl">Total (Ingresos, Gastos, Ahorro)</div> */}
      <AgCharts options={props.options} />

      <div className="font-bold text-2xl my-6">Gastos por Categorias</div>

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
          <div key={categoryName} className="py-6">
            <AgCharts
              options={
                {
                  title: {
                    text: `${categoryName}`,
                    fontSize: 20,
                  },
                  data,
                  series,
                  axes: [
                    {
                      type: "number",
                      position: "left",
                      label: {
                        formatter: ({ value }) =>
                          `${currency.symbol}${value.toFixed(2)}`,
                      },
                      min: 0,
                    },
                    {
                      type: "category",
                      position: "bottom",
                    },
                  ],
                  height: 450,
                } as AgChartProps["options"]
              }
            />
          </div>
        );
      })}
    </>
  );
};
