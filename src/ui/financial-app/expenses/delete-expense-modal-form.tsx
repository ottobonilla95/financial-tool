"use client";

import { deleteExpense, DeleteFormState } from "@/src/form-actions/expenses";
import { useEffect } from "react";
import { toast, TypeOptions } from "react-toastify";
import React from "react";
import { CancelButton, SubmitButton } from "../../forms";
import { Modal } from "../../components";
import { useTranslations } from "@/src/translations/use-translations";
import { useFormState } from "react-dom";

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
  const { dict, lang } = useTranslations();
  const deleteInvoiceWithId = deleteExpense.bind(null, expenseId, lang);

  const initialState: DeleteFormState = { message: {}, errors: {} };

  const [state, formAction] = useFormState(deleteInvoiceWithId, initialState);

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
        <div className="font-bold mb-1">{dict.forms?.expense.delete.title}</div>

        <div className="mb-5">{dict.forms?.expense.delete.message}</div>

        <div className="flex gap-4">
          <CancelButton onClick={closeModal} />
          <SubmitButton>{dict.forms?.shared.delete}</SubmitButton>
        </div>
      </form>
    </Modal>
  );
};
