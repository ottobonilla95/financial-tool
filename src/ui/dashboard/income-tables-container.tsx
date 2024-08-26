import { IncomeByCategory, Income } from "@/src/types";
import { IncomeTable } from "./income-table";

export type IncomeTableContainerProps = {
  earnings: Income[];
};

const splitByCategoryAndSubcategory = (expenses: Income[]) => {
  return expenses.reduce((acc: IncomeByCategory, expense) => {
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
}: IncomeTableContainerProps) => {
  const expensesByCategory = splitByCategoryAndSubcategory(earnings);

  return (
    <div className="mt-10">
      <div className="font-bold text-lg mb-5">Ingresos</div>
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-3 grid-flow-dense">
        {Object.entries(expensesByCategory).map(
          ([categoryName, subcategories]) => (
            <IncomeTable
              key={categoryName}
              categoryName={categoryName}
              subcategories={subcategories}
            />
          )
        )}
      </div>
    </div>
  );
};
