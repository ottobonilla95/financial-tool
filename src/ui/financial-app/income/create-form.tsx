"use client";

import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { createIncome, IncomeFormState } from "@/src/form-actions/income";
import { useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { EarningCategory } from "@/src/types";
import { toast, TypeOptions } from "react-toastify";
import { Dropdown, Modal, Spinner } from "../../components";
import {
  CreateIncomeCategoryForm,
  CreateIncomeSubCategoryForm,
} from "../income-categories";
import useSWR from "swr";
import { fetcher } from "@/src/utils/fetcher";
import { CancelButton, SubmitButton } from "../../forms";
import { formatDateToLocal } from "@/src/helpers/format-date-to-local";
import { useTranslations } from "@/src/translations/use-translations";
import { useFormState } from "react-dom";
import { AppContext } from "@/src/app-wrappper/provider";

export type CreateIncomeFormProps = {
  closeModal: () => void;
  month: number;
  year?: number;
};

export const CreateIncomeForm = ({
  closeModal,
  month,
  year,
}: CreateIncomeFormProps) => {
  const initialState: IncomeFormState = { message: {}, errors: {} };
  const { lang, dict } = useTranslations();
  const createIncomeAction = createIncome.bind(null, lang);

  const [state, formAction] = useFormState(createIncomeAction, initialState);

  const { currency, allCurrencies } = useContext(AppContext);

  const [categories, setCategories] = useState<EarningCategory[]>([]);

  const currentYear = year || new Date().getFullYear();

  const currentMonth = new Date().getMonth() + 1;

  const firstDayOfSelectedMonth = new Date(currentYear, month - 1, 1);
  const isCurrentMonth = month === currentMonth;
  const lastDayOfSelectedMonth = new Date(currentYear, month, 0); // Last day of the month
  // const maxDate = isCurrentMonth ? new Date() : lastDayOfSelectedMonth;

  const [startDate, setStartDate] = useState<Date | undefined>(
    month === currentMonth ? new Date() : new Date(currentYear, month - 1)
  );

  const [subCategories, setSubCategories] = useState<
    { name: string; id: string }[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>();
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [isSubCategoryFormOpen, setIsSubCategoryFormOpen] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // Currency related state
  const [selectedCurrency, setSelectedCurrency] = useState<string>();
  const [exchangeRate, setExchangeRate] = useState<number | undefined>();
  const [convertedAmount, setConvertedAmount] = useState<string>("");
  const [originalForeignAmount, setOriginalForeignAmount] = useState<string>("");
  const [showAnimation, setShowAnimation] = useState(false);

  const {
    data,
    mutate: getAllCategories,
    isLoading,
  } = useSWR("/api/income/category/get-all", fetcher, {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    // Set default currency when component loads
    if (currency && !selectedCurrency) {
      setSelectedCurrency(currency.id.toString());
    }
  }, [currency, selectedCurrency]);

  useEffect(() => {
    const loadedCategories = (data?.categories || []) as EarningCategory[];
    setCategories(loadedCategories);
    setSubCategories(
      loadedCategories.find((category) => category.id === selectedCategory)
        ?.subcategories || []
    );
  }, [data]);

  useEffect(() => {
    if (state.message?.text) {
      toast(state.message.text, { type: state.message.type as TypeOptions });
    }
    if (state.message?.type === "success") {
      setAmount("");
      setDescription("");
      // Reset currency to default user currency
      if (currency) {
        setSelectedCurrency(currency.id.toString());
      }
      setExchangeRate(undefined);
      setConvertedAmount("");
      setOriginalForeignAmount("");
    }
  }, [state, currency]);

  useEffect(() => {
    if (convertedAmount) {
      setShowAnimation(true);
      const timer = setTimeout(() => {
        setShowAnimation(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [convertedAmount]);

  // Fetch exchange rate function
  const fetchExchangeRate = async (
    fromCurrency: string,
    toCurrency: string
  ) => {
    try {
      const response = await fetch(
        `/api/exchange-rate?from=${fromCurrency}&to=${toCurrency}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch exchange rate");
      }
      const data = await response.json();
      return data.rate;
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      // Default fallback rate
      return 0.85;
    }
  };

  // Handle currency change
  const handleCurrencyChange = async (currencyId: string | undefined) => {
    setSelectedCurrency(currencyId);

    // Find the currency code for the selected currency
    const fromCurrencyCode = (allCurrencies || []).find(
      (c) => c.id.toString() === currencyId
    )?.currencyCode;

    // If currency is changed to user's default or is cleared, reset exchange rate and converted amount
    if (!currencyId || (currency && currencyId === currency.id.toString())) {
      setExchangeRate(undefined);
      setConvertedAmount("");
      setOriginalForeignAmount("");
    } else if (currency && fromCurrencyCode && currency.currencyCode) {
      // Fetch exchange rate
      const rate = await fetchExchangeRate(
        fromCurrencyCode,
        currency.currencyCode
      );
      setExchangeRate(rate);

      // If amount is already entered, calculate the converted value
      if (amount) {
        setOriginalForeignAmount(amount);
        const converted = (parseFloat(amount) * rate).toFixed(2);
        setConvertedAmount(converted);
      }
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(",", "."); // Normalize commas to dots
    if (!isNaN(Number(value)) || value === "") {
      setAmount(value); // Always update the displayed amount with what user types
      
      // If we're using a foreign currency, calculate the converted amount
      if (
        selectedCurrency &&
        currency &&
        selectedCurrency !== currency.id.toString() &&
        exchangeRate
      ) {
        setOriginalForeignAmount(value);

        // Calculate and update the converted amount for display only
        if (value) {
          const converted = (parseFloat(value) * exchangeRate).toFixed(2);
          setConvertedAmount(converted);
        } else {
          setConvertedAmount("");
        }
      }
    }
  };

  return (
    <>
      <CreateIncomeCategoryForm
        isOpen={isCategoryFormOpen}
        closeModal={() => setIsCategoryFormOpen(false)}
        onSuccess={getAllCategories}
      />

      <CreateIncomeSubCategoryForm
        category={{
          id: selectedCategory!,
          name:
            categories.find((category) => category.id === selectedCategory)
              ?.name || "",
        }}
        isOpen={isSubCategoryFormOpen}
        closeModal={() => setIsSubCategoryFormOpen(false)}
        onSuccess={getAllCategories}
      />

      <>
        <Modal isOpen onCloseModal={closeModal}>
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 bg-black z-50 opacity-70 flex items-center justify-center">
                <Spinner className="h-10 w-10" />
              </div>
            )}

            <form action={formAction}>
              <div className="rounded-md bg-gray-50 p-4 md:p-6 ">
                {/* date */}
                <div className="mb-4">
                  <label
                    htmlFor="amount"
                    className="mb-2 block text-sm font-medium"
                  >
                    {dict.forms?.shared.date} *
                  </label>
                  <div className="relative mt-2 rounded-md">
                    <div className="relative">
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date as Date)}
                        minDate={firstDayOfSelectedMonth}
                        dateFormat={"dd MMM yyyy"}
                        aria-describedby="date-error"
                        popperClassName="z-[1000000]"
                        calendarClassName="z-[1000000]"
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

                {/* Amount with Currency */}
                <div className="mb-4">
                  <label
                    htmlFor="amount"
                    className="mb-2 block text-sm font-medium"
                  >
                    {dict.forms?.shared.amount} *
                  </label>
                  <div className="relative mt-2 rounded-md flex">
                    <div className="relative flex-grow">
                      <input
                        id="amount"
                        name="amount"
                        type="text"
                        step="0.01"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder={dict.forms?.shared.enterAmount}
                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 pr-16 text-base outline-2 placeholder:text-gray-500"
                        required
                        aria-describedby="amount-error"
                      />
                      <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

                      {/* Show converted amount inside the field if a different currency is selected */}
                      {selectedCurrency &&
                        currency &&
                        selectedCurrency !== currency.id.toString() &&
                        convertedAmount && (
                          <span
                            className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-light transition-all ${
                              showAnimation ? "text-black font-normal" : ""
                            }`}
                          >
                            ≈ {currency.symbol} {convertedAmount}
                          </span>
                        )}
                    </div>
                    <div className="relative ml-2 w-[120px]">
                      <Dropdown
                        key={`currency-dropdown-${
                          selectedCurrency || "default"
                        }-${
                          state.message?.type === "success" ? Date.now() : "0"
                        }`}
                        options={(allCurrencies || []).map((c) => ({
                          value: c.id.toString(),
                          label: `${c.symbol} ${c.currencyCode}`,
                        }))}
                        onChange={(option) =>
                          handleCurrencyChange(option?.value)
                        }
                        defaultValue={
                          currency && selectedCurrency
                            ? {
                                value: selectedCurrency,
                                label: `${
                                  (allCurrencies || []).find(
                                    (c) => c.id.toString() === selectedCurrency
                                  )?.symbol || ""
                                } ${
                                  (allCurrencies || []).find(
                                    (c) => c.id.toString() === selectedCurrency
                                  )?.currencyCode || ""
                                }`,
                              }
                            : undefined
                        }
                        showAddButon={false}
                        isClearable={false}
                      />
                      <input
                        type="hidden"
                        name="currencyId"
                        value={
                          selectedCurrency ||
                          (currency ? currency.id.toString() : "")
                        }
                      />
                    </div>
                  </div>
                  {/* Show exchange rate below the field */}
                  {selectedCurrency &&
                    currency &&
                    selectedCurrency !== currency.id.toString() &&
                    exchangeRate && (
                      <div className="mt-1 text-xs text-gray-500 flex flex-col">
                        <span>Exchange rate: {exchangeRate.toFixed(4)}</span>
                      </div>
                    )}
                  <div id="amount-error" aria-live="polite" aria-atomic="true">
                    {state?.errors?.amount &&
                      state.errors.amount.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                      ))}
                  </div>
                </div>

                {/* Add hidden fields for currency conversion */}
                <input
                  type="hidden"
                  name="convertedAmount"
                  value={convertedAmount}
                />
                <input type="hidden" name="originalAmount" value={amount} />
                <input type="hidden" name="exchangeRate" value={exchangeRate} />

                {/* Category */}
                <div className="mb-4">
                  <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-medium"
                  >
                    {dict.forms?.shared.category} *
                  </label>
                  <div className="relative">
                    <Dropdown
                      options={[
                        ...categories.map((category) => ({
                          value: category.id,
                          label: category.name,
                        })),
                      ]}
                      onChange={(option) => {
                        setSelectedCategory(option?.value);
                        setSubCategories(
                          categories.find(
                            (category) => category.id === option?.value
                          )?.subcategories || []
                        );
                      }}
                      onAddNewClick={() => setIsCategoryFormOpen(true)}
                    />
                    <input
                      type="hidden"
                      name="categoryId"
                      value={selectedCategory}
                    />
                  </div>
                  <div
                    id="category-error"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {state?.errors?.categoryId &&
                      state.errors.categoryId.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                      ))}
                  </div>
                </div>

                {/* SubCategory */}
                {selectedCategory && (
                  <div className="mb-4">
                    <label
                      htmlFor="subCategory"
                      className="mb-2 block text-sm font-medium"
                    >
                      {dict.forms?.shared.subcategory}
                    </label>
                    <div className="relative">
                      <Dropdown
                        options={[
                          ...subCategories.map((category) => ({
                            value: category.id,
                            label: category.name,
                          })),
                        ]}
                        onChange={(option) =>
                          setSelectedSubCategory(option?.value)
                        }
                        onAddNewClick={() => setIsSubCategoryFormOpen(true)}
                      />

                      <input
                        type="hidden"
                        name="subCategoryId"
                        value={selectedSubCategory}
                      />
                    </div>
                  </div>
                )}

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
                    <div
                      id="description-error"
                      aria-live="polite"
                      aria-atomic="true"
                    >
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
          </div>
        </Modal>
      </>
    </>
  );
};
