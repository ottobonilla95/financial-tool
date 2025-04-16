import { AppDictionary } from "@/src/translations";
import { FinancialRecord } from "./expense-by-day-table";
import { Earning, Expense } from "@/src/types";
import { ExpensesByDayTableClient } from "./expenses-by-day-table-client";
import { useMemo } from "react";

export type ExpensesByDayTableContainerProps = {
  expenses: Expense[];
  earnings: Earning[];
  dict: AppDictionary;
  isPremium: boolean;
};

const splitByDay = (records: FinancialRecord[]) => {
  return records.reduce((acc: Record<string, FinancialRecord[]>, record) => {
    const day = record.date?.toISOString().split("T")[0] || "";
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(record);
    return acc;
  }, {});
};

export const ExpensesByDayTableContainer = ({
  expenses,
  earnings,
  dict,
  isPremium,
}: ExpensesByDayTableContainerProps) => {
  // Merge expenses and earnings
  const allRecords: FinancialRecord[] = useMemo(
    () => [
      ...expenses.map((expense) => ({ ...expense, type: "expense" })),
      ...earnings.map((earning) => ({ ...earning, type: "earning" })),
    ],
    [expenses, earnings]
  );

  const recordsByDay = splitByDay(allRecords);

  return (
    <div className="mt-10">
      <div className="font-bold mb-5 text-gray-600 uppercase">
        {dict.dashboard.totalFinancialRecords}
      </div>
      <ExpensesByDayTableClient
        recordsByDay={recordsByDay}
        dict={dict}
        isPremium={isPremium}
      />
    </div>
  );
};
