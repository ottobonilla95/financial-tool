"use client";

import { Button } from "../components/atoms";
import { PlusIcon } from "@heroicons/react/24/outline";
import { CreateExpenseForm } from "../expenses/create-form";
import { useState } from "react";
import { CreateIncomeForm } from "../income/create-form";
import { Emotion } from "@/src/types";
import { CreateSavingForm } from "../saving/create-form";

export type DashboardButtonsProps = { emotions: Emotion[] };

export const DashboardButtons = async ({ emotions }: DashboardButtonsProps) => {
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
          />
        </>
      )}
      {showCreateIncomeForm && (
        <CreateIncomeForm closeModal={() => setShowCreateIncomeForm(false)} />
      )}
      {showCreateSavingForm && (
        <CreateSavingForm closeModal={() => setShowCreateSavingForm(false)} />
      )}

      <div className="mb-10 flex gap-2 justify-end">
        <Button
          icon={<PlusIcon className="w-4" />}
          onClick={() => setShowCreateSavingForm(true)}
        >
          <span className="hidden sm:flex">Agregar ahorro</span>
          <span className="sm:hidden">Ahorro</span>
        </Button>
        <Button
          icon={<PlusIcon className="w-4" />}
          onClick={() => setShowCreateIncomeForm(true)}
        >
          <span className="hidden sm:flex">Agregar ingreso</span>
          <span className="sm:hidden">Ingreso</span>
        </Button>
        <Button
          icon={<PlusIcon className="w-4" />}
          onClick={() => setShowCreateExpenseForm(true)}
        >
          <span className="hidden sm:flex">Agregar gasto</span>
          <span className="sm:hidden">Gasto</span>
        </Button>
      </div>
    </>
  );
};
