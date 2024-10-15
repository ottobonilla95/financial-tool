"use client";

import {
  updateCategory,
  UpdateFormState,
} from "@/src/form-actions/expense-categories";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useActionState, useEffect } from "react";
import { toast, TypeOptions } from "react-toastify";
import React from "react";
import { ChromePicker } from "react-color";
import { ExpenseCategory } from "@/src/types";
import { CancelButton, SubmitButton } from "../../forms";
import { useTranslations } from "@/src/translations/use-translations";

export type UpdateCategoryFormProps = {
  isOpen: boolean;
  closeModal: () => void;
  category: ExpenseCategory;
};

export const UpdateCategoryForm = ({
  isOpen,
  closeModal,
  category,
}: UpdateCategoryFormProps) => {
  const initialState: UpdateFormState = { message: {}, errors: {} };

  const { lang, dict } = useTranslations();
  const updateCategoryAction = updateCategory.bind(null, lang);

  const [state, formAction] = useActionState(
    updateCategoryAction,
    initialState
  );
  const [color, setColor] = React.useState<string>(category.color);

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
              <DialogTitle className="font-bold">
                {dict.forms?.category.update.title}
              </DialogTitle>
              <input type="hidden" name="categoryId" value={category.id} />

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium"
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
                      defaultValue={category.name}
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
                    <ChromePicker
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
                <SubmitButton text={dict.forms?.shared.save} />
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};
