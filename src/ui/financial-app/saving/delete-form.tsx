"use client";

import { deleteSaving, DeleteFormState } from "@/src/form-actions/saving";
import { useActionState, useEffect } from "react";
import { toast, TypeOptions } from "react-toastify";
import React from "react";
import { CancelButton, SubmitButton } from "../../forms";
import { Modal } from "../../components";
import { useTranslations } from "@/src/translations/use-translations";

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
  const { lang } = useTranslations();

  const deleteInvoiceWithId = deleteSaving.bind(null, savingId, lang);

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
        <div className="font-bold mb-1">Eliminar ahorro</div>

        <div className="mb-5">¿Esta seguro que desea eliminar este ahorro?</div>

        <div className="flex gap-4">
          <CancelButton onClick={closeModal} />
          <SubmitButton text="Eliminar" />
        </div>
      </form>
    </Modal>
  );
};
