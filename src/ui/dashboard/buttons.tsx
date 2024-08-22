"use client";

import { Button } from "../components/atoms";
import { PlusIcon } from "@heroicons/react/24/outline";
import { CreateExpenseForm } from "../expenses/create-form";
import { useState } from "react";
import { CreateIncomeForm } from "../income/create-form";

export type DashboardButtonsProps = {};

export const DashboardButtons = async ({}: DashboardButtonsProps) => {
  const [showCreateExpenseForm, setShowCreateExpenseForm] = useState(false);
  const [showCreateIncomeForm, setShowCreateIncomeForm] = useState(false);

  return (
    <>
      {showCreateExpenseForm && (
        <CreateExpenseForm
          isOpen
          closeModal={() => setShowCreateExpenseForm(false)}
        />
      )}
      {showCreateIncomeForm && (
        <CreateIncomeForm
          isOpen
          closeModal={() => setShowCreateIncomeForm(false)}
        />
      )}

      <div className="mb-10 flex gap-2 justify-end">
        <Button
          icon={<PlusIcon className="w-4" />}
          onClick={() => setShowCreateIncomeForm(true)}
        >
          Agregar ingreso
        </Button>
        <Button
          icon={<PlusIcon className="w-4" />}
          onClick={() => setShowCreateExpenseForm(true)}
        >
          Agregar gasto
        </Button>
      </div>
    </>
  );
};
