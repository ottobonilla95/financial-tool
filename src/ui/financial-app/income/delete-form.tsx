"use client";

import { deleteIncome, DeleteFormState } from "@/src/form-actions/income";
import { useEffect } from "react";
import { toast, TypeOptions } from "react-toastify";
import React from "react";
import { CancelButton, SubmitButton } from "../../forms";
import { Modal } from "../../components";
import { useTranslations } from "@/src/translations/use-translations";
import { useFormState } from "react-dom";

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
  const { lang, dict } = useTranslations();

  const deleteInvoiceWithId = deleteIncome.bind(null, incomeId, lang);

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
        <div className="font-bold mb-1">{dict.forms?.income.delete.title}</div>

        <div className="mb-5">{dict.forms?.income.delete.message}</div>

        <div className="flex gap-4">
          <CancelButton onClick={closeModal} />
          <SubmitButton text={dict.forms?.shared.delete} />
        </div>
      </form>
    </Modal>
  );
};
