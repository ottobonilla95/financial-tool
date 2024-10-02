"use client";

import React from "react";
import {
  IncomeSubCategoryFormState,
  createIncomeSubCategory,
} from "@/src/form-actions/income-sub-category";
import { useActionState, useEffect } from "react";
import { toast, TypeOptions } from "react-toastify";
import { CancelButton, SubmitButton } from "../forms";
import { Modal } from "../components";
import { useTranslations } from "@/src/translations/use-translations";

export type CreateIncomeSubCategoryFormProps = {
  category: { id: string; name: string };
  closeModal: () => void;
  isOpen: boolean;
  onSuccess?: () => void;
};

export const CreateIncomeSubCategoryForm = ({
  category,
  closeModal,
  isOpen,
  onSuccess,
}: CreateIncomeSubCategoryFormProps) => {
  const initialState: IncomeSubCategoryFormState = { message: {}, errors: {} };

  const { lang } = useTranslations();
  const createIncomeSubCategoryAction = createIncomeSubCategory.bind(
    null,
    lang
  );

  const [state, formAction] = useActionState(
    createIncomeSubCategoryAction,
    initialState
  );

  useEffect(() => {
    if (state.message) {
      toast(state.message.text, { type: state.message.type as TypeOptions });
      if (state.message.type === "success") {
        closeModal();
        if (onSuccess) {
          onSuccess();
        }
      }
    }
  }, [state]);

  return (
    <Modal isOpen={isOpen} onCloseModal={closeModal} zIndex={60}>
      <form action={formAction}>
        <div className="font-bold mb-2">Nueva Sub Categoría</div>

        <div className="flex mb-2">
          <div className="font-bold">Categoría:</div>
          <div>{` ${category.name}`}</div>
          <input type="hidden" name="categoryId" value={category.id} />
        </div>
        <div className="mb-4">
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                step="0.01"
                placeholder="Ingresa el nombre"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                required
                aria-describedby="name-error"
              />
            </div>
            <div id="name-error" aria-live="polite" aria-atomic="true">
              {state?.errors?.name &&
                state.errors.name.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <CancelButton onClick={closeModal} />
          <SubmitButton text="Guardar" />
        </div>
      </form>
    </Modal>
  );
};
