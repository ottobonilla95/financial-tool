"use client";

import { deleteIncome, DeleteFormState } from "@/src/form-actions/income";
import { useActionState, useEffect } from "react";
import { toast, TypeOptions } from "react-toastify";
import React from "react";
import { CancelButton, SubmitButton } from "../forms";
import { Modal } from "../components";

export type DeleteIncomeFormProps = {
  isOpen: boolean;
  closeModal: () => void;
  incomeId: string;
};

export const DeleteIncomeForm = ({
  isOpen,
  closeModal,
  incomeId,
}: DeleteIncomeFormProps) => {
  const deleteInvoiceWithId = deleteIncome.bind(null, incomeId);

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
    <Modal isOpen={isOpen} onCloseModal={closeModal}>
      <form action={formAction}>
        <div className="font-bold mb-1">Eliminar ingreso</div>

        <div className="mb-5">¿Esta seguro que desea eliminar este ingreso?</div>

        <div className="flex gap-4">
          <CancelButton onClick={closeModal} />
          <SubmitButton text="Eliminar" />
        </div>
      </form>
    </Modal>
  );
};
