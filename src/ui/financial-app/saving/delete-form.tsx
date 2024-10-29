"use client";

import { deleteSaving, DeleteFormState } from "@/src/form-actions/saving";
import { useEffect } from "react";
import { toast, TypeOptions } from "react-toastify";
import React from "react";
import { CancelButton, SubmitButton } from "../../forms";
import { Modal } from "../../components";
import { useTranslations } from "@/src/translations/use-translations";
import { useFormState } from "react-dom";

export type DeleteSavingFormProps = {
  isOpen: boolean;
  closeModal: () => void;
  savingId: string;
};

export const DeleteSavingForm = ({
  isOpen,
  closeModal,
  savingId,
}: DeleteSavingFormProps) => {
  const { lang, dict } = useTranslations();

  const deleteInvoiceWithId = deleteSaving.bind(null, savingId, lang);

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
        <div className="font-bold mb-1">{dict.forms?.saving.delete.title}</div>

        <div className="mb-5">{dict.forms?.saving.delete.message}</div>

        <div className="flex gap-4">
          <CancelButton onClick={closeModal} />
          <SubmitButton>{dict.forms?.shared.delete}</SubmitButton>
        </div>
      </form>
    </Modal>
  );
};
