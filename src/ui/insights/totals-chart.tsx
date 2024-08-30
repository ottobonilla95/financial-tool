"use client";

import React, { useState } from "react";
import { AgCharts, AgChartProps } from "ag-charts-react";
import { Expense } from "@/src/types";

export type PieChartProps = { expenses: Expense[] };

function getMonthlyTotals(expenses: Expense[]) {
  function getMonthYear(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  }

  const monthlyTotals: { [monthYear: string]: number } = {};

  expenses.forEach((expense) => {
    const monthYear = getMonthYear(expense.expenseDate.toISOString());

    if (!monthlyTotals[monthYear]) {
      monthlyTotals[monthYear] = 0;
    }

    monthlyTotals[monthYear] += expense.amount;
  });

  return Object.entries(monthlyTotals).map(([monthYear, total]) => ({
    monthYear,
    total: parseFloat(total.toFixed(2)),
  }));
}

export const TotalLineChart = ({ expenses }: PieChartProps) => {
  const data = getMonthlyTotals(expenses);

  const [props] = useState<AgChartProps>({
    options: {
      title: {
        text: "Total gastos",
      },
      subtitle: {
        text: "Ultimos 3 meses",
      },
      data: data,

      series: [
        {
          type: "line",
          xKey: "monthYear",
          xName: "Mes",
          yKey: "total",
          yName: "Total",
          interpolation: { type: "linear" },
        },
      ],
    },
  });

  return <AgCharts options={props.options} className="h-[400px]" />;
};
