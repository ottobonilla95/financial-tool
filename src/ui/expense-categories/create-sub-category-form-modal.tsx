"use client";

import React from "react";
import {
  SubCategoryFormState,
  createSubCategory,
} from "@/src/form-actions/expense-sub-category";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useActionState, useEffect } from "react";
import { toast, TypeOptions } from "react-toastify";
import { CancelButton, SubmitButton } from "../forms";

export type CreateSubCategoryFormProps = {
  category: { id: string; name: string };
  isOpen: boolean;
  closeModal: () => void;
};

export const CreateSubCategoryForm = ({
  category,
  isOpen,
  closeModal,
}: CreateSubCategoryFormProps) => {
  const initialState: SubCategoryFormState = { message: {}, errors: {} };
  const [state, formAction] = useActionState(createSubCategory, initialState);

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
      {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-50" />}
      <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
            <form action={formAction}>
              <DialogTitle className="font-bold mb-2">
                Nueva Sub Categoría
              </DialogTitle>

              <div className="flex mb-2">
                <div className="font-bold">Categoría:</div>
                <div>{category.name}</div>
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
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};
