import { Expense } from "@/src/types";
import { Price } from "../../components";
import clsx from "clsx";
import { FaceSmileIcon } from "@heroicons/react/24/outline";
import { AppDictionary } from "@/src/translations";

export type groupExpensesBySatisfactionProps = {
  expenses: Expense[];
  dict: AppDictionary;
};

function groupExpensesBySatisfaction(
  expenses: Expense[]
): Record<number, number> {
  return expenses.reduce((acc, expense) => {
    const satisfactionLevel = expense.satisfaction;
    if (!acc[satisfactionLevel]) {
      acc[satisfactionLevel] = 0;
    }
    acc[satisfactionLevel] += expense.amount;
    return acc;
  }, {} as Record<number, number>);
}

const getSatifactionLabel = (satisfaction: string) => {
  switch (satisfaction) {
    case "1":
      return "Very Unsatisfied";
    case "2":
      return "Unsatisfied";
    case "3":
      return "Neutral";
    case "4":
      return "Satisfied";
    case "5":
      return "Very Satisfied";
    default:
      return "Unknown";
  }
};

export const DashboardExpeneseBySatisfaction = ({
  expenses,
  dict,
}: groupExpensesBySatisfactionProps) => {
  const groupedExpenses = groupExpensesBySatisfaction(expenses);

  return (
    <div className="bg-white shadow-sm px-5 py-4 cursor-pointer rounded-sm w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-600 font-bold uppercase">
          {dict.dashboard.bySatisfaction}
        </span>

        <div
          className={clsx(
            "w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md bg-lime-100"
          )}
        >
          <FaceSmileIcon className="w-4" />
        </div>
      </div>

      <ul className="list-none">
        {Object.entries(groupedExpenses).map(([satisfaction, total]) => (
          <li
            key={satisfaction}
            className="hover:bg-gray-100 transition py-4 px-2"
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-500">
                {getSatifactionLabel(satisfaction)}
              </span>
              <Price amount={total} className="text-gray-500" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
