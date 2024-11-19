"use client";

import {
  createCategory,
  CategoryFormState,
} from "@/src/form-actions/expense-categories";
import { useEffect } from "react";
import { toast, TypeOptions } from "react-toastify";
import React from "react";
import { CirclePicker } from "react-color";
import { CancelButton, SubmitButton } from "../../forms";
import { Modal } from "../../components";
import { useTranslations } from "@/src/translations/use-translations";
import { useFormState } from "react-dom";

export type CreateCategoryFormProps = {
  isOpen: boolean;
  closeModal: () => void;
  onSuccess?: () => void;
};

export const CreateCategoryForm = ({
  isOpen,
  closeModal,
  onSuccess,
}: CreateCategoryFormProps) => {
  const initialState: CategoryFormState = { message: {}, errors: {} };

  const { lang, dict } = useTranslations();
  const createCategoryAction = createCategory.bind(null, lang);

  const [state, formAction] = useFormState(createCategoryAction, initialState);

  const [color, setColor] = React.useState<string>();

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
        <div className="font-bold mb-2">
          {dict.forms?.category.create.title}
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium"
          >
            {dict.forms?.shared.name}
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                step="0.01"
                placeholder={dict.forms?.shared.name}
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
        <div className="mb-4">
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium"
          >
            {dict.forms?.shared.color}
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <CirclePicker
                onChange={(value) => setColor(value.hex)}
                color={color}
              />
              <input type="hidden" name="color" value={color} />
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
          <SubmitButton>{dict.forms?.shared.save}</SubmitButton>
        </div>
      </form>
    </Modal>
  );
};
