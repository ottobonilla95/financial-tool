import { Expense } from "@/src/types";
import { Price } from "../../components";
import clsx from "clsx";
import { FaceSmileIcon } from "@heroicons/react/24/outline";
import { AppDictionary } from "@/src/translations";

export type groupExpensesBySatisfactionProps = {
  expenses: Expense[];
  dict: AppDictionary;
};

function groupExpensesBySatisfaction(expenses: Expense[]): {
  [key: number]: { total: number; percentage: number };
} {
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return expenses.reduce((acc, expense) => {
    const satisfactionLevel = expense.satisfaction;
    if (!acc[satisfactionLevel]) {
      acc[satisfactionLevel] = { total: 0, percentage: 0 };
    }
    acc[satisfactionLevel].total += expense.amount;
    acc[satisfactionLevel].percentage =
      (acc[satisfactionLevel].total / totalExpenses) * 100;
    return acc;
  }, {} as { [key: number]: { total: number; percentage: number } });
}
const getSatifactionLabel = (satisfaction: string, dict: AppDictionary) => {
  switch (satisfaction) {
    case "1":
      return dict.shared.satisfactionLevels.veryUnsatisfied;
    case "2":
      return dict.shared.satisfactionLevels.unsatisfied;
    case "3":
      return dict.shared.satisfactionLevels.neutral;
    case "4":
      return dict.shared.satisfactionLevels.satisfied;
    case "5":
      return dict.shared.satisfactionLevels.verySatisfied;
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
            className="hover:bg-neutral-100 transition py-4 px-2"
          >
            <div className="flex justify-between items-center">
              <span className="text-neutral-500">
                {getSatifactionLabel(satisfaction, dict)}
              </span>
              <div className="flex gap-2 justify-between">
                <span className="text-neutral-400">{`(${total.percentage.toFixed(
                  2
                )}%)`}</span>
                <Price
                  amount={total.total}
                  className="text-neutral-600 font-medium"
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
