"use client";

import React, { useMemo } from "react";
import { AgCharts, AgChartProps } from "ag-charts-react";
import { Expense } from "@/src/types";

export type PieChartProps = { expenses: Expense[] };

type CategoryTotal = {
  category: string;
  amount: number;
  color: string;
};

const calculateTotalPerCategory = (expenses: Expense[]): CategoryTotal[] => {
  const totals: { [key: string]: { amount: number; color: string } } = {};

  expenses.forEach((expense) => {
    const categoryName = expense.category.name;
    const amount = Number(expense.amount);

    if (!totals[categoryName]) {
      totals[categoryName] = { amount: 0, color: expense.category.color };
    }
    totals[categoryName].amount += amount;
  });

  return Object.entries(totals).map(([category, { amount, color }]) => ({
    category,
    amount,
    color,
  }));
};

export const ExpensesPieChart = ({ expenses }: PieChartProps) => {
  const data = calculateTotalPerCategory(expenses);

  const props = useMemo<AgChartProps>(() => {
    return {
      options: {
        data,
        series: [
          {
            type: "pie",
            angleKey: "amount",
            calloutLabelKey: "category",
            sectorLabelKey: "amount",
            sectorLabel: {
              color: "white",
              fontWeight: "bold",
            },
            fills: data.map((d) => d.color),
          },
        ],
      },
    };
  }, [data]);

  return <AgCharts options={props.options} className="h-[400px]" />;
};
