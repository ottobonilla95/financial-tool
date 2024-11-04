"use client";

import React, { useMemo } from "react";
import { AgCharts, AgChartProps } from "ag-charts-react";
import { Currency, Expense } from "@/src/types";
import { formatCurrency } from "@/src/helpers/format-currency";

export type PieChartProps = { expenses: Expense[]; currency: Currency };

type CategoryTotal = {
  category: string;
  amount: number;
  color: string;
  formattedAmount: string;
};

const calculateTotalPerCategory = (
  expenses: Expense[],
  currency: Currency
): CategoryTotal[] => {
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
    formattedAmount: formatCurrency(amount, currency), // Add formatted amount
  }));
};

export const ExpensesPieChart = ({ expenses, currency }: PieChartProps) => {
  const data = calculateTotalPerCategory(expenses, currency);

  const props = useMemo<AgChartProps>(() => {
    return {
      options: {
        data,
        series: [
          {
            type: "pie",
            angleKey: "amount",
            calloutLabelKey: "category",
            sectorLabelKey: "formattedAmount", // Use formatted amount for labels
            sectorLabel: {
              color: "white",
              fontWeight: "bold",
            },
            fills: data.map((d) => d.color),
            tooltip: {
              renderer: ({ datum }) => ({
                content: `${datum.category}: ${datum.formattedAmount}`, // Format tooltip
              }),
            },
          },
        ],
      },
    };
  }, [data]);

  return (
    <div className="shadow-sm rounded-sm bg-white">
      <AgCharts options={props.options} className="h-[400px]" />
    </div>
  );
};
