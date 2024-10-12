import { Expense } from "@/src/types";
import { Price } from "../components";
import clsx from "clsx";
import { HeartIcon } from "@heroicons/react/24/outline";
import { capitalizeFirstLetter } from "@/src/helpers/capitalize-first-letter";
import { AppDictionary } from "@/src/translations";

export type DashboardExpeneseByEmotionProps = {
  expenses: Expense[];
  dict: AppDictionary;
};

function groupExpensesByEmotion(expenses: Expense[]): Record<string, number> {
  return expenses.reduce((acc, expense) => {
    const emotionName = expense.emotion?.name || "No Emotion"; // Handle cases where emotion might be missing
    if (!acc[emotionName]) {
      acc[emotionName] = 0;
    }
    acc[emotionName] += expense.amount;
    return acc;
  }, {} as Record<string, number>);
}

export const DashboardExpeneseByEmotion = ({
  expenses,
  dict,
}: DashboardExpeneseByEmotionProps) => {
  const groupedExpenses = groupExpensesByEmotion(expenses);

  return (
    <div className="bg-white shadow-sm px-5 py-4 cursor-pointer rounded-sm w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-600 font-bold uppercase">{dict.dashboard.byEmotion}</span>

        <div
          className={clsx(
            "w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md bg-pink-100"
          )}
        >
          <HeartIcon className="w-4" />
        </div>
      </div>

      <ul className="list-none">
        {Object.entries(groupedExpenses).map(([emotion, total]) => (
          <li key={emotion} className="hover:bg-gray-100 transition py-4 px-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">
                {capitalizeFirstLetter(
                  dict.forms?.expense.create[
                    emotion as keyof typeof dict.forms.expense.create
                  ] || ""
                )}
              </span>
              <Price amount={total} className="text-gray-500" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
