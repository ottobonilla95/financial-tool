"use client";

import { Button } from "../components/atoms";
import { PlusIcon } from "@heroicons/react/24/outline";
import { CreateExpenseForm } from "../expenses/create-form";
import { useState } from "react";

export type DashboardButtonsProps = {};

export const DashboardButtons = async ({}: DashboardButtonsProps) => {
  const [showCreateExpenseForm, setShowCreateExpenseForm] = useState(false);

  return (
    <>
      {showCreateExpenseForm && (
        <CreateExpenseForm
          isOpen
          closeModal={() => setShowCreateExpenseForm(false)}
        />
      )}

      <div className="mb-10 flex justify-end">
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
