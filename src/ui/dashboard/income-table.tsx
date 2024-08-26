"use client";

import { darkenHexColor } from "@/src/helpers/darken-color";
import { IncomeCategory, Income } from "@/src/types";
import clsx from "clsx";
import { format } from "date-fns";
import { DeleteIncomeForm } from "../income/delete-form";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { Button } from "../components";
import { useState } from "react";
import { UpdateCategoryForm } from "../income-categories";

export type IncomeTableProps = {
  categoryName: string;
  subcategories: {
    [subcategoryName: string]: Income[];
  };
};

const calculateSubcategoryTotal = (incomes: Income[]) => {
  return incomes.reduce((acc, income) => acc + income.amount, 0);
};
const calculateTotal = (subcategories: {
  [subcategoryName: string]: Income[];
}) => {
  return Object.values(subcategories).reduce(
    (acc, incomes) => acc + calculateSubcategoryTotal(incomes),
    0
  );
};

const getCategory = (subcategories: {
  [subcategoryName: string]: Income[];
}): IncomeCategory => {
  for (const incomeArray of Object.values(subcategories)) {
    const income = incomeArray[0];

    return income.category;
  }

  return {} as IncomeCategory;
};

export const IncomeTable = ({
  categoryName,
  subcategories,
}: IncomeTableProps) => {
  const getCategoryColor = (subcategories: {
    [subcategoryName: string]: Income[];
  }): string => {
    for (const incomeArray of Object.values(subcategories)) {
      const income = incomeArray[0];

      return income.category.color;
    }

    return "#FFFFFF";
  };
  const color = getCategoryColor(subcategories);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [incomeIdToDelete, setIncomeIdToDelete] = useState<string>();

  const [isUpdateCategoryModalOpen, setIsUpdateCategoryModalOpen] =
    useState(false);
  const [categoryToUpdate, setCategoryToUpdate] = useState<
    Partial<IncomeCategory>
  >({});

  return (
    <>
      <DeleteIncomeForm
        isOpen={isDeleteModalOpen}
        closeModal={() => setIsDeleteModalOpen(false)}
        incomeId={incomeIdToDelete as string}
      />

      {isUpdateCategoryModalOpen && (
        <UpdateCategoryForm
          category={categoryToUpdate as IncomeCategory}
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
            className="!w-10"
          >
            <PencilIcon className="w-4" />
          </Button>
        </div>
        {Object.entries(subcategories).map(
          ([subcategoryName, incomeArray], index) => (
            <div
              key={subcategoryName}
              className={clsx("mb-2", {
                "mb-0": index === Object.entries(subcategories).length - 1,
              })}
            >
              <h3 className="font-bold text-base  py-2 px-4">
                {subcategoryName}
              </h3>
              {incomeArray.map((income) => (
                <div key={income.id} className="grid grid-cols-4 py-2 px-4">
                  <div className="font-medium flex items-center">
                    {income.description}
                  </div>

                  <div className="flex items-center justify-center">
                    {format(income.incomeDate, "EEE dd")}
                  </div>
                  <div className="flex items-center justify-end">
                    {income.amount}
                  </div>

                  <div className="flex items-center justify-end">
                    <Button
                      onClick={() => {
                        setIsDeleteModalOpen(true);
                        setIncomeIdToDelete(income.id);
                      }}
                      className="!w-10"
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
                  {calculateSubcategoryTotal(incomeArray).toFixed(2)}
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
