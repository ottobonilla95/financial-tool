"use client";

import React, { useMemo, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import { Currency, Expense } from "@/src/types";
import { formatCurrency } from "@/src/helpers/format-currency";
import { capitalizeFirstLetter } from "@/src/helpers/capitalize-first-letter";

export type PieChartProps = { expenses: Expense[]; currency: Currency };

const calculateTotalPerCategory = (expenses: Expense[], currency: Currency) => {
  const totals: {
    [key: string]: { amount: number; color: string; categoryId: string | null };
  } = {};

  expenses.forEach((expense) => {
    const categoryName = expense.category.name;
    const amount = Number(expense.amount);

    if (!totals[categoryName]) {
      totals[categoryName] = {
        amount: 0,
        color: expense.category.color,
        categoryId: expense.category.id,
      };
    }
    totals[categoryName].amount += amount;
  });

  return Object.entries(totals).map(
    ([category, { amount, color, categoryId }]) => ({
      id: capitalizeFirstLetter(category),
      categoryId: categoryId,
      label: capitalizeFirstLetter(category),
      value: amount,
      color,
      formattedAmount: formatCurrency(amount, currency),
    })
  );
};

const calculateTotalPerSubcategory = (
  expenses: Expense[],
  currency: Currency
) => {
  const totals: {
    [key: string]: {
      amount: number;
      color: string;
      categoryId?: string | null;
    };
  } = {};

  expenses.forEach((expense) => {
    const categoryName = expense.subcategory.name;
    const amount = Number(expense.amount);

    if (!totals[categoryName]) {
      totals[categoryName] = {
        amount: 0,
        color: expense.category.color,
      };
    }
    totals[categoryName].amount += amount;
  });

  return Object.entries(totals).map(([category, { amount, color }]) => ({
    id: capitalizeFirstLetter(category),
    label: capitalizeFirstLetter(category),
    categoryId: null,
    value: amount,
    color: color,
    formattedAmount: formatCurrency(amount, currency),
  }));
};

export const ExpensesPieChart = ({ expenses, currency }: PieChartProps) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>();

  const data = useMemo(() => {
    if (selectedCategoryId) {
      const subcategoryExpenses = expenses.filter(
        (expense) => expense.category.id === selectedCategoryId
      );
      return calculateTotalPerSubcategory(subcategoryExpenses, currency);
    }
    return calculateTotalPerCategory(expenses, currency);
  }, [expenses, currency, selectedCategoryId]);

  return (
    <div style={{ height: 400 }} className="shadow-sm rounded-sm bg-white">
      <ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
        arcLabel={(e) => formatCurrency(e.value, currency)}
        innerRadius={0.5} // Makes it a donut chart
        padAngle={0.7} // Adds spacing between slices
        cornerRadius={3} // Rounds edges of slices
        activeOuterRadiusOffset={8} // Expands on hover
        colors={{ datum: "data.color" }} // Uses custom colors
        borderWidth={1}
        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
        onClick={(e) => setSelectedCategoryId(e.data.categoryId)}
        tooltip={({ datum }) => (
          <div
            style={{
              padding: "5px 10px",
              background: "white",
              color: datum.data.color,
              borderRadius: "4px",
              boxShadow: "0px 0px 5px rgba(0,0,0,0.15)",
            }}
          >
            {datum.data.label}: {datum.data.formattedAmount}
          </div>
        )}
      />
    </div>
  );
};
