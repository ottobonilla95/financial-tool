import { EarningByCategory, Earning } from "@/src/types";
import { IncomeTable } from "./income-table";
import { AppDictionary } from "@/src/translations";

export type IncomeTableContainerProps = {
  earnings: Earning[];
  dict: AppDictionary;
};

const splitByCategoryAndSubcategory = (expenses: Earning[]) => {
  return expenses.reduce((acc: EarningByCategory, expense) => {
    const { category, subcategory } = expense;
    if (!acc[category.name]) {
      acc[category.name] = {};
    }
    if (!acc[category.name][subcategory.name]) {
      acc[category.name][subcategory.name] = [];
    }
    acc[category.name][subcategory.name].push(expense);
    return acc;
  }, {});
};

export const IncomeTableContainer = ({
  earnings,
  dict,
}: IncomeTableContainerProps) => {
  const expensesByCategory = splitByCategoryAndSubcategory(earnings);

  return (
    <div className="mt-10">
      <div className="font-bold mb-5 text-gray-600 uppercase">{dict.shared.income}</div>
      <div className="gap-4 grid grid-cols-1 lg:grid-cols-3 grid-flow-dense">
        {Object.entries(expensesByCategory).map(
          ([categoryName, subcategories]) => (
            <IncomeTable
              key={categoryName}
              categoryName={categoryName}
              subcategories={subcategories}
              dict={dict}
            />
          )
        )}
      </div>
    </div>
  );
};
