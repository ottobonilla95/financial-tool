"use client";

import { useContext } from "react";
import { DashboardContext } from "./provider";
import { ExpenseByDayTable } from "./expense-by-day-table";
import { FinancialRecord } from "./expense-by-day-table";
import { AppDictionary } from "@/src/translations";

type ExpensesByDayTableClientProps = {
  recordsByDay: Record<string, FinancialRecord[]>;
  dict: AppDictionary;
  isPremium: boolean;
};

export const ExpensesByDayTableClient = ({
  recordsByDay,
  dict,
  isPremium,
}: ExpensesByDayTableClientProps) => {
  const { selectedCategories } = useContext(DashboardContext);

  // Filter records by selected categories
  const filteredRecordsByDay = Object.entries(recordsByDay).reduce(
    (acc, [day, records]) => {
      const filteredRecords = records.filter((record) =>
        selectedCategories.includes(record.category.id)
      );
      if (filteredRecords.length > 0) {
        acc[day] = filteredRecords;
      }
      return acc;
    },
    {} as Record<string, FinancialRecord[]>
  );

  // Sort by latest first
  const sortedEntries = Object.entries(filteredRecordsByDay).sort(
    ([dayA], [dayB]) => new Date(dayB).getTime() - new Date(dayA).getTime()
  );

  if (selectedCategories.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-sm shadow-sm">
        <p className="text-gray-500 mb-2">
          {dict.dashboard.noSelectedCategories}
        </p>
        <p className="text-sm text-gray-400">
          {dict.dashboard.selectCategoryToViewRecords}
        </p>
      </div>
    );
  }

  if (sortedEntries.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-sm shadow-sm">
        <p className="text-gray-500 mb-2">
          {dict.dashboard.noRecordsForSelectedCategories}
        </p>
        <p className="text-sm text-gray-400">
          {dict.dashboard.trySelectingDifferentCategories}
        </p>
      </div>
    );
  }

  return (
    <div className="gap-4 grid grid-cols-1 grid-flow-dense">
      {sortedEntries.map(([day, dayRecords]) => (
        <div key={day} className="day-section">
          <ExpenseByDayTable
            records={dayRecords}
            dict={dict}
            isPremium={isPremium}
          />
        </div>
      ))}
    </div>
  );
};
