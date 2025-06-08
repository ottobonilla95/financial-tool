"use client";

import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { createSaving, SavingFormState } from "@/src/form-actions/saving";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { toast, TypeOptions } from "react-toastify";
import { Modal } from "../../components";
import { CancelButton, SubmitButton } from "../../forms";
import { formatDateToLocal } from "@/src/helpers/format-date-to-local";
import { useTranslations } from "@/src/translations/use-translations";
import { useFormState } from "react-dom";

export type CreateSavingFormProps = {
  closeModal: () => void;
  month: number;
  year?: number;
};

export const CreateSavingForm = ({
  closeModal,
  month,
  year,
}: CreateSavingFormProps) => {
  const initialState: SavingFormState = { message: {}, errors: {} };
  const { lang, dict } = useTranslations();
  const createSavingAction = createSaving.bind(null, lang);

  const [state, formAction] = useFormState(createSavingAction, initialState);
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const currentYear = year || new Date().getFullYear();

  const currentMonth = new Date().getMonth() + 1;

  const [startDate, setStartDate] = useState<Date | undefined>(
    month === currentMonth ? new Date() : new Date(currentYear, month - 1)
  );
  const firstDayOfSelectedMonth = new Date(currentYear, month - 1, 1);
  const isCurrentMonth = month === currentMonth;
  const lastDayOfSelectedMonth = new Date(currentYear, month, 0); // Last day of the month
  // const maxDate = isCurrentMonth ? new Date() : lastDayOfSelectedMonth;

  useEffect(() => {
    if (state.message?.text) {
      toast(state.message.text, { type: state.message.type as TypeOptions });
      if (state.message.type === "success") {
        closeModal();
      }
    }
  }, [state]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(",", "."); // Normalize commas to dots
    if (!isNaN(Number(value)) || value === "") {
      setAmount(value);
    }
  };

  return (
    <Modal isOpen onCloseModal={closeModal}>
      <form action={formAction}>
        <div className="p-4 md:p-6 !pt-[80px]">
          {/* date */}
          <div className="mb-4">
            <label htmlFor="amount" className="mb-2 block text-sm font-medium">
              {dict.forms?.shared.date} *
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date as Date)}
                  minDate={firstDayOfSelectedMonth}
                  aria-describedby="date-error"
                  dateFormat={"dd MMM yyyy"}
                  popperClassName="z-[10000000]"
                  calendarClassName="z-[10000000]"
                  className="peer block w-full rounded-md border border-gray-200 py-2 text-base outline-2 placeholder:text-gray-500"
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
          {/* Amount */}
          <div className="mb-4">
            <label htmlFor="amount" className="mb-2 block text-sm font-medium">
              {dict.forms?.shared.amount} *
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="amount"
                  name="amount"
                  type="text"
                  step="0.01"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder={dict.forms?.shared.enterAmount}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-base outline-2 placeholder:text-gray-500"
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
          {/* Description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium"
            >
              {dict.forms?.shared.description}
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="description"
                  name="description"
                  type="text"
                  step="0.01"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={dict.forms?.shared.enterDescription}
                  className="peer block w-full rounded-md border border-gray-200 py-2 text-base outline-2 placeholder:text-gray-500"
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
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <CancelButton onClick={closeModal} />
          <SubmitButton>{dict.forms?.shared.save}</SubmitButton>
        </div>
      </form>
    </Modal>
  );
};
