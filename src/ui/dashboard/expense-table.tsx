"use client";

import { darkenHexColor } from "@/src/helpers/darken-color";
import { Category, Expense } from "@/src/types";
import clsx from "clsx";
import { format } from "date-fns";
import { DeleteExpenseForm } from "./delete-expense-modal-form";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { Button } from "../components";
import { useState } from "react";
import { UpdateCategoryForm } from "../categories";

export type ExpenseTableProps = {
  categoryName: string;
  subcategories: {
    [subcategoryName: string]: Expense[];
  };
};

export type ExpensesByCategory = {
  [categoryName: string]: {
    [subcategoryName: string]: Expense[];
  };
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
}): Category => {
  for (const expenseArray of Object.values(subcategories)) {
    const expense = expenseArray[0];

    return expense.category;
  }

  return {} as Category;
};

export const ExpenseTable = ({
  categoryName,
  subcategories,
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
  const [categoryToUpdate, setCategoryToUpdate] = useState<Partial<Category>>(
    {}
  );

  return (
    <>
      <DeleteExpenseForm
        isOpen={isDeleteModalOpen}
        closeModal={() => setIsDeleteModalOpen(false)}
        expenseId={expenseIdToDelete as string}
      />

      {isUpdateCategoryModalOpen && (
        <UpdateCategoryForm
          category={categoryToUpdate as Category}
          closeModal={() => setIsUpdateCategoryModalOpen(false)}
          isOpen
        />
      )}

      <div
        style={{
          backgroundColor: color,
        }}
        className="rounded"
      >
        <div className="flex items-center justify-between py-2 px-4">
          <h2 className="font-bold text-lg mb-2 uppercase">{categoryName}</h2>
          <Button
            onClick={() => {
              setIsUpdateCategoryModalOpen(true);
              setCategoryToUpdate(getCategory(subcategories));
            }}
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
              <h3 className="font-bold text-base  py-2 px-4">
                {subcategoryName}
              </h3>
              {expenseArray.map((expense) => (
                <div key={expense.id} className="grid grid-cols-4 py-2 px-4">
                  <div className="font-medium flex items-center">
                    {expense.description}
                  </div>

                  <div className="flex items-center justify-center">
                    {format(expense.expenseDate, "EEE dd")}
                  </div>
                  <div className="flex items-center justify-end">
                    {expense.amount}
                  </div>

                  <div className="flex items-center justify-end">
                    <Button
                      onClick={() => {
                        setIsDeleteModalOpen(true);
                        setExpenseIdToDelete(expense.id);
                      }}
                    >
                      <TrashIcon className="w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <div
                className="flex justify-between py-2 px-4"
                style={{
                  backgroundColor: darkenHexColor(color, 0.07),
                }}
              >
                <div className="font-bold">Total</div>
                <div className="font-bold">
                  {calculateSubcategoryTotal(expenseArray).toFixed(2)}
                </div>
              </div>
            </div>
          )
        )}
        <div
          className="flex justify-between py-2 px-4 rounded"
          style={{
            backgroundColor: darkenHexColor(color, 0.15),
          }}
        >
          <div className="font-bold">Total</div>
          <div className="font-bold">
            {calculateTotal(subcategories).toFixed(2)}
          </div>
        </div>
      </div>
    </>
  );
};
