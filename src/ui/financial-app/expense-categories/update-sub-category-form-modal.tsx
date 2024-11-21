"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect } from "react";
import { toast, TypeOptions } from "react-toastify";
import React from "react";
import { ExpenseSubCategory } from "@/src/types";
import { CancelButton, SubmitButton } from "../../forms";
import { useTranslations } from "@/src/translations/use-translations";
import { useFormState } from "react-dom";
import {
  UpdateFormState,
  updateSubCategory,
} from "@/src/form-actions/expense-sub-category";

export type UpdateSubCategoryFormProps = {
  isOpen: boolean;
  closeModal: () => void;
  subCategory: ExpenseSubCategory;
  onSuccess?: () => void;
};

export const UpdateSubCategoryForm = ({
  isOpen,
  closeModal,
  subCategory,
  onSuccess,
}: UpdateSubCategoryFormProps) => {
  const initialState: UpdateFormState = { message: {}, errors: {} };

  const { lang, dict } = useTranslations();
  const updateSubCategoryAction = updateSubCategory.bind(null, lang);

  const [state, formAction] = useFormState(
    updateSubCategoryAction,
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
    <>
      {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-40" />}
      <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
            <form action={formAction}>
              <DialogTitle className="font-bold mb-2">
                {dict.forms?.subCategory.update.title}
              </DialogTitle>
              <input
                type="hidden"
                name="subCategoryId"
                value={subCategory.id}
              />

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
                      defaultValue={subCategory.name}
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
                <SubmitButton>{dict.forms?.shared.save}</SubmitButton>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};
