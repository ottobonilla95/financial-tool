"use client";

import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { createSaving, SavingFormState } from "@/src/form-actions/saving";
import { useActionState, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { toast, TypeOptions } from "react-toastify";
import { Modal } from "../components";
import { CancelButton, SubmitButton } from "../forms";
import { formatDateToLocal } from "@/src/helpers/format-date-to-local";

export type CreateSavingFormProps = {
  closeModal: () => void;
  month: number;
};

export const CreateSavingForm = ({
  closeModal,
  month,
}: CreateSavingFormProps) => {
  const initialState: SavingFormState = { message: {}, errors: {} };
  const [state, formAction] = useActionState(createSaving, initialState);
  const currentYear = new Date().getFullYear();
  const [startDate, setStartDate] = useState(new Date(currentYear, month - 1));

  useEffect(() => {
    if (state.message?.text) {
      toast(state.message.text, { type: state.message.type as TypeOptions });
      if (state.message.type === "success") {
        closeModal();
      }
    }
  }, [state]);

  return (
    <Modal isOpen onCloseModal={closeModal}>
      <form action={formAction}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6 ">
          {/* Description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium"
            >
              Descripción *
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="description"
                  name="description"
                  type="text"
                  step="0.01"
                  placeholder="Ingresa la descripción"
                  className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                  required
                  aria-describedby="description-error"
                />
              </div>
              <div id="description-error" aria-live="polite" aria-atomic="true">
                {state?.errors?.description &&
                  state.errors.description.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label htmlFor="amount" className="mb-2 block text-sm font-medium">
              Cantidad *
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  placeholder="Ingresa cantidad"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  required
                  aria-describedby="amount-error"
                />
                <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
              <div id="amount-error" aria-live="polite" aria-atomic="true">
                {state?.errors?.amount &&
                  state.errors.amount.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
          </div>
          {/* date */}
          <div className="mb-4">
            <label htmlFor="amount" className="mb-2 block text-sm font-medium">
              Fecha *
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date as Date)}
                  maxDate={new Date()}
                  aria-describedby="date-error"
                  dateFormat={"dd MMM yyyy"}
                  className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                />
                <input
                  type="hidden"
                  name="date"
                  value={startDate ? formatDateToLocal(startDate) : ""}
                />
              </div>
              <div id="date-error" aria-live="polite" aria-atomic="true">
                {state?.errors?.date &&
                  state.errors.date.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <CancelButton onClick={closeModal} />
          <SubmitButton text="Guardar" />
        </div>
      </form>
    </Modal>
  );
};
