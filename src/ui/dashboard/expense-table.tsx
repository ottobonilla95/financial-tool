"use client";

import { ExpenseCategory, Expense, Emotion } from "@/src/types";
import clsx from "clsx";
import { format } from "date-fns";
import { DeleteExpenseForm } from "../expenses/delete-expense-modal-form";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { Button, Price } from "../components";
import { useState } from "react";
import { UpdateCategoryForm } from "../expense-categories";
import { Tooltip } from "react-tooltip";
import { AppDictionary } from "@/src/translations";

export type ExpenseTableProps = {
  categoryName: string;
  subcategories: {
    [subcategoryName: string]: Expense[];
  };
  dict: AppDictionary;
};

const calculateSubcategoryTotal = (expenses: Expense[]) => {
  return expenses.reduce((acc, expense) => acc + expense.amount, 0);
};
const calculateTotal = (subcategories: {
  [subcategoryName: string]: Expense[];
}) => {
  return Object.values(subcategories).reduce(
    (acc, expenses) => acc + calculateSubcategoryTotal(expenses),
    0
  );
};

const getCategory = (subcategories: {
  [subcategoryName: string]: Expense[];
}): ExpenseCategory => {
  for (const expenseArray of Object.values(subcategories)) {
    const expense = expenseArray[0];

    return expense.category;
  }

  return {} as ExpenseCategory;
};
export const ExpenseSatisfactionIcon = ({
  satisfaction,
}: {
  satisfaction: number;
}) => {
  if (satisfaction === 1) {
    return (
      <div
        className="cursor-pointer"
        data-tooltip-id="my-tooltip"
        data-tooltip-content="Muy insatisfecho"
      >
        &#128534;
      </div>
    );
  }
  if (satisfaction === 2) {
    return (
      <div
        className="cursor-pointer"
        data-tooltip-id="my-tooltip"
        data-tooltip-content="Insatisfecho"
      >
        &#128530;
      </div>
    );
  }
  if (satisfaction === 3) {
    return (
      <div
        className="cursor-pointer"
        data-tooltip-id="my-tooltip"
        data-tooltip-content="Neutral"
      >
        &#128578;
      </div>
    );
  }
  if (satisfaction === 4) {
    return (
      <div
        className="cursor-pointer"
        data-tooltip-id="my-tooltip"
        data-tooltip-content="Satisfecho"
      >
        &#128512;
      </div>
    );
  }
  if (satisfaction === 5) {
    return (
      <div
        className="cursor-pointer"
        data-tooltip-id="my-tooltip"
        data-tooltip-content="Muy satisfecho"
      >
        &#128513;
      </div>
    );
  }
};

export const ExpenseEmotionIcon = ({ emotionType, name }: Partial<Emotion>) => {
  if (emotionType === "positive") {
    return (
      <div
        className="cursor-pointer"
        data-tooltip-id="my-tooltip"
        data-tooltip-content={name}
      >
        &#128513;
      </div>
    );
  }

  if (emotionType === "negative") {
    return (
      <div
        className="cursor-pointer"
        data-tooltip-id="my-tooltip"
        data-tooltip-content={name}
      >
        &#128533;
      </div>
    );
  }

  return (
    <div
      className="cursor-pointer"
      data-tooltip-id="my-tooltip"
      data-tooltip-content={name}
    >
      &#128578;
    </div>
  );
};

export const ExpenseTable = ({
  categoryName,
  subcategories,
  dict,
}: ExpenseTableProps) => {
  const getCategoryColor = (subcategories: {
    [subcategoryName: string]: Expense[];
  }): string => {
    for (const expenseArray of Object.values(subcategories)) {
      const expense = expenseArray[0];

      return expense.category.color;
    }

    return "#FFFFFF";
  };
  const color = getCategoryColor(subcategories);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [expenseIdToDelete, setExpenseIdToDelete] = useState<string>();

  const [isUpdateCategoryModalOpen, setIsUpdateCategoryModalOpen] =
    useState(false);
  const [categoryToUpdate, setCategoryToUpdate] = useState<
    Partial<ExpenseCategory>
  >({});

  return (
    <>
      <Tooltip id="my-tooltip" />
      <DeleteExpenseForm
        isOpen={isDeleteModalOpen}
        closeModal={() => setIsDeleteModalOpen(false)}
        expenseId={expenseIdToDelete as string}
      />

      {isUpdateCategoryModalOpen && (
        <UpdateCategoryForm
          category={categoryToUpdate as ExpenseCategory}
          closeModal={() => setIsUpdateCategoryModalOpen(false)}
          isOpen
        />
      )}

      <div className="shadow-sm rounded-sm bg-white">
        <div
          style={{
            backgroundColor: color,
          }}
          className="h-[4px] rounded-t-sm"
        />
        <div className="flex items-center justify-between py-2 px-4">
          <h2 className="font-bold text-lg mb-2 uppercase text-gray-600">
            {categoryName}
          </h2>

          <Button
            onClick={() => {
              setIsUpdateCategoryModalOpen(true);
              setCategoryToUpdate(getCategory(subcategories));
            }}
            className="!w-10"
          >
            <PencilIcon className="w-4" />
          </Button>
        </div>
        {Object.entries(subcategories).map(
          ([subcategoryName, expenseArray], index) => (
            <div
              key={subcategoryName}
              className={clsx("mb-2", {
                "mb-0": index === Object.entries(subcategories).length - 1,
              })}
            >
              <h3 className="font-bold text-base  py-2 px-4 text-gray-600">
                {subcategoryName}
              </h3>
              <div className="grid grid-cols-5 sm:grid-cols-6 py-2 px-4 text-gray-600">
                <div className="font-bold flex items-center">
                  {dict.shared.name}
                </div>
                <div className="font-bold flex items-center justify-center">
                  {dict.shared.date}
                </div>
                <div className="font-bold flex items-center justify-center">
                  {dict.shared.price}
                </div>
                <div className="font-bold flex items-center justify-center">
                  {dict.shared.satisfaction}
                </div>
                <div className="font-bold  items-center justify-center hidden sm:flex">
                  {dict.shared.emotion}
                </div>
                <div></div>
              </div>
              {expenseArray.map((expense) => (
                <div
                  key={expense.id}
                  className="grid grid-cols-5 sm:grid-cols-6 py-2 px-4 text-gray-500"
                >
                  <div className="font-medium flex items-center">
                    {expense.description}
                  </div>

                  <div className="flex items-center justify-center">
                    {format(expense.date, "EEE dd")}
                  </div>
                  <div className="flex items-center justify-center">
                    <Price amount={expense.amount} />
                  </div>
                  <div className="flex items-center justify-center">
                    <ExpenseSatisfactionIcon
                      satisfaction={expense.satisfaction}
                    />
                  </div>
                  <div className="items-center justify-center hidden sm:flex">
                    <ExpenseEmotionIcon {...expense.emotion} />
                  </div>

                  <div className="flex items-center justify-end">
                    <Button
                      onClick={() => {
                        setIsDeleteModalOpen(true);
                        setExpenseIdToDelete(expense.id);
                      }}
                      className="!w-10"
                    >
                      <TrashIcon className="w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between py-2 px-4">
                <div className="font-bold text-gray-600">
                  {dict.shared.total}
                </div>
                <div className="font-bold text-gray-600">
                  <Price amount={calculateSubcategoryTotal(expenseArray)} />
                </div>
              </div>
            </div>
          )
        )}
        <div className="flex justify-between py-2 px-4 rounded">
          <div className="font-bold text-gray-600">{dict.shared.total}</div>
          <div className="font-bold text-gray-600">
            <Price amount={calculateTotal(subcategories)} />
          </div>
        </div>
      </div>
    </>
  );
};
