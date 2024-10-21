"use client";

import { Button } from "../../components/atoms";
import { PlusIcon } from "@heroicons/react/24/outline";
import { CreateExpenseForm } from "../expenses/create-form";
import { useState } from "react";
import { CreateIncomeForm } from "../income/create-form";
import { Emotion } from "@/src/types";
import { CreateSavingForm } from "../saving/create-form";
import { AppDictionary } from "@/src/translations";
import { DashboardDatePicker } from "./date-picker";

export type DashboardButtonsProps = {
  emotions: Emotion[];
  month: number;
  dict: AppDictionary;
};

export const DashboardButtons = async ({
  emotions,
  month,
  dict,
}: DashboardButtonsProps) => {
  const [showCreateExpenseForm, setShowCreateExpenseForm] = useState(false);
  const [showCreateIncomeForm, setShowCreateIncomeForm] = useState(false);
  const [showCreateSavingForm, setShowCreateSavingForm] = useState(false);

  return (
    <>
      {showCreateExpenseForm && (
        <>
          <CreateExpenseForm
            closeModal={() => setShowCreateExpenseForm(false)}
            emotions={emotions}
            month={month}
          />
        </>
      )}
      {/* {showCreateIncomeForm && (
        <CreateIncomeForm
          closeModal={() => setShowCreateIncomeForm(false)}
          month={month}
        />
      )}
      {showCreateSavingForm && (
        <CreateSavingForm
          closeModal={() => setShowCreateSavingForm(false)}
          month={month}
        />
      )} */}

      <div className="flex lg:flex-row gap-4 flex-col mb-10">
        <div>
          <DashboardDatePicker />
        </div>

        <div className="flex gap-2 justify-end flex-1">
          <div className="flex-1 lg:flex-none">
            <Button
              icon={<PlusIcon className="w-4" />}
              onClick={() => setShowCreateSavingForm(true)}
              className="tour-step-1 bg-black text-white"
            >
              <span className="hidden sm:flex">{dict.dashboard.addSaving}</span>
              <span className="sm:hidden">{dict.dashboard.saving}</span>
            </Button>
          </div>
          <div className="flex-1 lg:flex-none">
            <Button
              icon={<PlusIcon className="w-4" />}
              onClick={() => setShowCreateIncomeForm(true)}
              className="tour-step-2 bg-black text-white"
            >
              <span className="hidden sm:flex">{dict.dashboard.addIncome}</span>
              <span className="sm:hidden">{dict.shared.income}</span>
            </Button>
          </div>
          <div className="flex-1 lg:flex-none">
            <Button
              icon={<PlusIcon className="w-4" />}
              onClick={() => setShowCreateExpenseForm(true)}
              className="tour-step-3 bg-black text-white"
            >
              <span className="hidden sm:flex">
                {dict.dashboard.addExpense}
              </span>
              <span className="sm:hidden">{dict.dashboard.expense}</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
