import { AppDictionary } from "@/src/translations";
import { ExpenseByDayTable, FinancialRecord } from "./expense-by-day-table";
import { Earning, Expense } from "@/src/types";

export type ExpensesByDayTableContainerProps = {
  expenses: Expense[];
  earnings: Earning[];
  dict: AppDictionary;
  isPremium: boolean;
};

const splitByDay = (records: FinancialRecord[]) => {
  return records.reduce((acc: Record<string, FinancialRecord[]>, record) => {
    const day = record.date?.toISOString().split("T")[0] || ""; // Extract the date part (YYYY-MM-DD)
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
  const allRecords: FinancialRecord[] = [
    ...expenses.map((expense) => ({ ...expense, type: "expense" })),
    ...earnings.map((earning) => ({ ...earning, type: "earning" })),
  ];

  const recordsByDay = splitByDay(allRecords);

  // Sort by latest first
  const sortedEntries = Object.entries(recordsByDay).sort(
    ([dayA], [dayB]) => new Date(dayB).getTime() - new Date(dayA).getTime()
  );

  return (
    <div className="mt-10">
      <div className="font-bold mb-5 text-gray-600 uppercase">
        {dict.dashboard.totalFinancialRecords}
      </div>
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
    </div>
  );
};
