"use client";

import { deleteExpense, DeleteFormState } from "@/src/form-actions/expenses";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useActionState, useEffect } from "react";
import { toast, TypeOptions } from "react-toastify";
import React from "react";
import { CancelButton, SubmitButton } from "../forms";

export type DeleteExpenseFormProps = {
  isOpen: boolean;
  closeModal: () => void;
  expenseId: string;
};

export const DeleteExpenseForm = ({
  isOpen,
  closeModal,
  expenseId,
}: DeleteExpenseFormProps) => {
  const deleteInvoiceWithId = deleteExpense.bind(null, expenseId);

  const initialState: DeleteFormState = { message: {}, errors: {} };
  const [state, formAction] = useActionState(deleteInvoiceWithId, initialState);

  useEffect(() => {
    if (state.message) {
      toast(state.message.text, { type: state.message.type as TypeOptions });
      if (state.message.type === "success") {
        closeModal();
      }
    }
  }, [state]);

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-40" />}
      <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
            <form action={formAction}>
              <DialogTitle className="font-bold mb-1">
                Eliminar gasto
              </DialogTitle>

              <div className="mb-5">
                ¿Esta seguro que desea eliminar este gasto?
              </div>

              <div className="flex gap-4">
                <CancelButton onClick={closeModal} />
                <SubmitButton text="Eliminar" />
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};
