"use client";

import React, { useState } from "react";
import { AgCharts, AgChartProps } from "ag-charts-react";
import { Expense, Earning, Saving } from "@/src/types";

export type PieChartProps = {
  expenses: Expense[];
  earnings: Earning[];
  savings: Saving[];
};

function getMonthlyTotals(
  expenses: Expense[],
  earnings: Earning[],
  savings: Saving[]
) {
  function getMonthYear(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  }

  const monthlyTotals: {
    [monthYear: string]: {
      expenses: number;
      earnings: number;
      savings: number;
    };
  } = {};

  expenses.forEach((expense) => {
    const monthYear = getMonthYear(expense.date.toISOString());

    if (!monthlyTotals[monthYear]) {
      monthlyTotals[monthYear] = { expenses: 0, earnings: 0, savings: 0 };
    }

    monthlyTotals[monthYear].expenses += expense.amount;
  });
  earnings.forEach((earning) => {
    const monthYear = getMonthYear(earning.date.toISOString());

    if (!monthlyTotals[monthYear]) {
      monthlyTotals[monthYear] = { expenses: 0, earnings: 0, savings: 0 };
    }

    monthlyTotals[monthYear].earnings += earning.amount;
  });
  savings.forEach((saving) => {
    const monthYear = getMonthYear(saving.date.toISOString());

    if (!monthlyTotals[monthYear]) {
      monthlyTotals[monthYear] = { expenses: 0, earnings: 0, savings: 0 };
    }

    monthlyTotals[monthYear].savings += saving.amount;
  });

  return Object.entries(monthlyTotals).map(([monthYear, totals]) => ({
    monthYear,
    expenses: parseFloat(totals.expenses.toFixed(2)),
    earnings: parseFloat(totals.earnings.toFixed(2)),
    savings: parseFloat(totals.savings.toFixed(2)),
  }));
}

export const TotalLineChart = ({
  expenses,
  earnings,
  savings,
}: PieChartProps) => {
  const data = getMonthlyTotals(expenses, earnings, savings);

  const [props] = useState<AgChartProps>({
    options: {
      title: {
        text: "Total",
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
          yName: "Ganancias",
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
    },
  });

  return <AgCharts options={props.options} className="h-[400px]" />;
};
