"use client";

import {
  CurrencyDollarIcon,
  FaceSmileIcon,
  FaceFrownIcon,
} from "@heroicons/react/24/outline";
import {
  updateExpense,
  UpdateExpenseFormState,
} from "@/src/form-actions/expenses";
import { useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import {
  Emotion,
  Expense,
  ExpenseCategory,
  ExpenseSubCategory,
} from "@/src/types";
import { toast, TypeOptions } from "react-toastify";
import { Button, Dropdown, Modal, Spinner } from "../../components";
import {
  CreateCategoryForm,
  CreateSubCategoryForm,
  UpdateCategoryForm,
} from "../expense-categories";
import useSWR from "swr";
import { fetcher } from "@/src/utils/fetcher";
import { CancelButton, SubmitButton } from "../../forms";
import clsx from "clsx";
import { formatDateToLocal } from "@/src/helpers/format-date-to-local";
import { useTranslations } from "@/src/translations/use-translations";
import { MAX_CATEGORIES_FREE_PLAN } from "@/src/constants/categories";
import { AppContext } from "@/src/app-wrappper/provider";
import { useFormState, useFormStatus } from "react-dom";
import { UpdateSubCategoryForm } from "../expense-categories/update-sub-category-form-modal";

export type UpdateExpenseFormProps = {
  closeModal: () => void;
  emotions: Emotion[];
  month: number;
  year?: number;
  expense: Expense;
};

export const LoadingPlaceholder = () => {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <div className="absolute inset-0 bg-black z-50 opacity-70 flex items-center justify-center">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }
  return null;
};

export const UpdateExpenseForm = ({
  closeModal,
  emotions,
  month,
  year,
  expense,
}: UpdateExpenseFormProps) => {
  const { dict, lang } = useTranslations();

  const updateExpenseAction = updateExpense.bind(null, expense.id, lang);

  const { subscriptionDetails, currency, allCurrencies } = useContext(AppContext);
  const isPremium = subscriptionDetails?.isPremium;

  const initialState: UpdateExpenseFormState = { message: {}, errors: {} };

  const { pending: loading } = useFormStatus();
  const [state, formAction] = useFormState(updateExpenseAction, initialState);

  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const currentYear = year || new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const firstDayOfSelectedMonth = new Date(currentYear, month - 1, 1);
  const isCurrentMonth = month === currentMonth;
  const lastDayOfSelectedMonth = new Date(currentYear, month, 0); // Last day of the month
  const maxDate = isCurrentMonth ? new Date() : lastDayOfSelectedMonth;

  // Fix timezone issue: create a local date that represents the same day
  const expenseLocalDate = new Date(
    expense.date.getUTCFullYear(),
    expense.date.getUTCMonth(),
    expense.date.getUTCDate()
  );
  const [startDate, setStartDate] = useState<Date>(expenseLocalDate);

  const [subCategories, setSubCategories] = useState<
    { name: string; id: string }[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    expense.category.id
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>();
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [isSubCategoryFormOpen, setIsSubCategoryFormOpen] = useState(false);
  const [isUpdateCategoryModalOpen, setIsUpdateCategoryModalOpen] =
    useState(false);
  const [categoryToUpdate, setCategoryToUpdate] = useState<
    Partial<ExpenseCategory>
  >({});

  const [isUpdateSubCategoryModalOpen, setIsUpdateSubCategoryModalOpen] =
    useState(false);
  const [subCategoryToUpdate, setSubCategoryToUpdate] = useState<
    Partial<ExpenseCategory>
  >({});

  const [selectedSatisfaction, setSelectedSatisfaction] = useState(
    expense.satisfaction
  );
  const [selectedEmotion, setSelectedEmotion] = useState(expense.emotion.id);
  const [showSubcategories, setShowSubcategories] = useState(true);
  const [showCategories, setShowCategories] = useState(true);
  const [amount, setAmount] = useState<string>(expense.amount.toString());
  const [description, setDescription] = useState<string>(expense.description);
  const [renderForm, setRenderForm] = useState<boolean>(false);

  // Currency related state
  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    expense.currency?.id?.toString() || currency?.id?.toString() || ""
  );
  const [exchangeRate, setExchangeRate] = useState<number | undefined>(expense.exchangeRate || undefined);
  const [convertedAmount, setConvertedAmount] = useState<string>(
    expense.amount.toString()
  );
  const [originalForeignAmount, setOriginalForeignAmount] = useState<string>(
    expense.originalAmount ? expense.originalAmount.toString() : ""
  );
  const [showAnimation, setShowAnimation] = useState(false);

  const {
    data,
    mutate: getAllCategories,
    isLoading,
  } = useSWR("/api/expense/category/get-all", fetcher, {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    const loadedCategories = (data?.categories || []) as ExpenseCategory[];
    setCategories(loadedCategories);
    setSubCategories(
      loadedCategories.find((category) => category.id === selectedCategory)
        ?.subcategories || []
    );

    setTimeout(() => {
      setShowCategories(true);
      setShowSubcategories(true);
    }, 10);
  }, [data]);

  useEffect(() => {
    if (state.message?.text) {
      toast(state.message.text, { type: state.message.type as TypeOptions });
    }
  }, [state]);

  useEffect(() => {
    if (!showSubcategories) {
      setTimeout(() => {
        setShowSubcategories(true);
      }, 10);
    }
  }, [showSubcategories]);

  useEffect(() => {
    if (categories.length > 0) {
      setSelectedCategory(expense.category.id);
      const subCategories =
        categories.find((category) => category.id === expense.category.id)
          ?.subcategories || [];

      setSubCategories(subCategories);
      if (expense.subcategory?.id !== "") {
        setSelectedSubCategory(expense.subcategory.id);
      }

      setShowSubcategories(true);
      setRenderForm(true);
    }
  }, [expense, categories]);

  // Add useEffect for currency animation
  useEffect(() => {
    if (convertedAmount) {
      setShowAnimation(true);
      const timer = setTimeout(() => {
        setShowAnimation(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [convertedAmount]);

  // Add exchange rate fetching function
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
      return 0.85;
    }
  };

  // Add currency change handler
  const handleCurrencyChange = async (currencyId: string | undefined) => {
    if (!currencyId) {
      setSelectedCurrency("");
      setExchangeRate(undefined);
      setConvertedAmount("");
      setOriginalForeignAmount("");
      return;
    }

    setSelectedCurrency(currencyId);

    const fromCurrencyCode = (allCurrencies || []).find(
      (c) => c.id.toString() === currencyId
    )?.currencyCode;

    if (currency && fromCurrencyCode && currency.currencyCode) {
      const rate = await fetchExchangeRate(
        fromCurrencyCode,
        currency.currencyCode
      );
      setExchangeRate(rate);

      if (amount) {
        setOriginalForeignAmount(amount);
        const converted = (parseFloat(amount) * rate).toFixed(2);
        setConvertedAmount(converted);
      }
    }
  };

  // Update amount change handler
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(",", ".");

    if (!isNaN(Number(value)) || value === "") {
      setAmount(value);

      if (
        selectedCurrency &&
        currency &&
        selectedCurrency !== currency.id.toString() &&
        exchangeRate
      ) {
        setOriginalForeignAmount(value);

        if (value) {
          const converted = (parseFloat(value) * exchangeRate).toFixed(2);
          setConvertedAmount(converted);
        } else {
          setConvertedAmount("");
        }
      }
    }
  };

  if (!renderForm) {
    return null;
  }

  return (
    <>
      <CreateCategoryForm
        isOpen={isCategoryFormOpen}
        closeModal={() => setIsCategoryFormOpen(false)}
        onSuccess={getAllCategories}
      />
      <CreateSubCategoryForm
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
      {isUpdateCategoryModalOpen && (
        <UpdateCategoryForm
          category={categoryToUpdate as ExpenseCategory}
          closeModal={() => setIsUpdateCategoryModalOpen(false)}
          isOpen
          onSuccess={() => {
            getAllCategories();
            setShowCategories(false);
          }}
        />
      )}

      {isUpdateSubCategoryModalOpen && (
        <UpdateSubCategoryForm
          subCategory={subCategoryToUpdate as ExpenseSubCategory}
          closeModal={() => setIsUpdateSubCategoryModalOpen(false)}
          isOpen
          onSuccess={() => {
            getAllCategories();
            setShowSubcategories(false);
          }}
        />
      )}

      <>
        <Modal isOpen onCloseModal={closeModal}>
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 bg-black z-50 opacity-70 flex items-center justify-center">
                <Spinner className="h-10 w-10" />
              </div>
            )}

            <form action={formAction}>
              <LoadingPlaceholder />
              <input type="hidden" name="id" value={expense.id} />
              <div className="rounded-md p-4 md:p-6 ">
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
                        maxDate={maxDate}
                        minDate={firstDayOfSelectedMonth}
                        aria-describedby="date-error"
                        dateFormat={"dd MMM yyyy"}
                        popperClassName="z-[1000000]"
                        calendarClassName="z-[1000000]"
                        className="peer block w-full rounded-md border border-gray-200 py-2 text-base outline-2 placeholder:text-gray-500 z-[100001]"
                      />

                      <input
                        type="hidden"
                        name="date"
                        value={formatDateToLocal(startDate)}
                        disabled={loading}
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
                        disabled={loading}
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
                        disabled={loading}
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
                  <div
                    id="amount-error"
                    aria-live="polite"
                    aria-atomic="true"
                  >
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
                {showCategories && (
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
                          const subCategories =
                            categories.find(
                              (category) => category.id === option?.value
                            )?.subcategories || [];

                          setSubCategories(subCategories);
                          setSelectedSubCategory(undefined);
                          setShowSubcategories(false);
                        }}
                        onAddNewClick={() => setIsCategoryFormOpen(true)}
                        disabled={loading}
                        onEditClick={(value) => {
                          setCategoryToUpdate(
                            categories.find((c) => c.id === value)!
                          );
                          setIsUpdateCategoryModalOpen(true);
                        }}
                        showEditButton
                        defaultValue={categories
                          .map((category) => ({
                            value: category.id,
                            label: category.name,
                          }))
                          .find((option) => option.value === selectedCategory)}
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
                )}

                {/* SubCategory */}
                {selectedCategory && showSubcategories && (
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
                        disabled={loading}
                        onEditClick={(value) => {
                          setSubCategoryToUpdate(
                            subCategories.find((c) => c.id === value)!
                          );
                          setIsUpdateSubCategoryModalOpen(true);
                        }}
                        showEditButton
                        defaultValue={subCategories
                          .map((category) => ({
                            value: category.id,
                            label: category.name,
                          }))
                          .find(
                            (option) => option.value === selectedSubCategory
                          )}
                      />

                      <input
                        type="hidden"
                        name="subCategoryId"
                        value={selectedSubCategory}
                      />
                    </div>
                  </div>
                )}

                {!isPremium && (
                  <div className="flex justify-end gap-4 mb-4">
                    <CancelButton onClick={closeModal} />
                    <SubmitButton>{dict.forms?.shared.save}</SubmitButton>
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
                        disabled={loading}
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

                {/* plenitud */}
                <div className="relative py-3 ">
                  {!isPremium && !isLoading && (
                    <>
                      <div
                        className="bg-black inset-0 absolute blur-sm rounded-md z-[1000]"
                        style={{ opacity: "10%" }}
                      />
                      <div className="inset-0 absolute flex items-center p-5  z-[10001]">
                        <div className="w-full p-5 rounded-md border border-gray-200 border-solid bg-white">
                          <div className="text-lg font-bold  mb-3">
                            {
                              dict.shared?.subscriptionMessages
                                .addEmotionsAndLevelOfSatisfactionTitle
                            }
                          </div>
                          <div className=" mb-3">
                            {
                              dict.shared?.subscriptionMessages
                                .addEmotionsAndLevelOfSatisfactionMessage
                            }
                          </div>
                          {subscriptionDetails?.isUserOnStripe ? (
                            <Button
                              href={
                                subscriptionDetails.stripeCustomerPortalLink
                              }
                              target="_blank"
                              className="text-white bg-black"
                            >
                              {`${dict.shared?.manageSubscription}`}
                            </Button>
                          ) : (
                            <Button
                              href="/dashboard/pricing"
                              className="text-white bg-black"
                            >{`${dict.shared?.goPremium}`}</Button>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  <div
                    className={clsx({
                      "blur-sm p-5": !isPremium,
                    })}
                  >
                    <fieldset>
                      <legend className="mb-2 block text-sm font-medium">
                        {dict.forms?.expense.create.levelOfSatisfaction}
                      </legend>
                      <div className="pb-4 ">
                        <div className="flex gap-1 flex-wrap">
                          <div className="flex items-center rounded-md border-solid border-gray-200 border px-2">
                            <input
                              id="1"
                              name="fulfillment"
                              type="radio"
                              value="1"
                              className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                              onChange={() => setSelectedSatisfaction(1)}
                              checked={selectedSatisfaction === 1}
                              disabled={loading}
                            />
                            <label
                              htmlFor="1"
                              className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full py-1.5 text-xs font-medium"
                            >
                              <span className="px-2 py-1 rounded-md bg-red-200">
                                <FaceFrownIcon className="h-4 w-4" />
                              </span>
                            </label>
                          </div>
                          <div className="flex items-center rounded-md border-solid border-gray-200 border px-2">
                            <input
                              id="2"
                              name="fulfillment"
                              type="radio"
                              value="2"
                              className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                              onChange={() => setSelectedSatisfaction(2)}
                              checked={selectedSatisfaction === 2}
                              disabled={loading}
                            />
                            <label
                              htmlFor="2"
                              className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full py-1.5 text-xs font-medium"
                            >
                              <span className="px-2 py-1 rounded-md bg-red-100">
                                <FaceFrownIcon className="h-4 w-4" />
                              </span>
                            </label>
                          </div>
                          <div className="flex items-center rounded-md border-solid border-gray-200 border px-2">
                            <input
                              id="3"
                              name="fulfillment"
                              type="radio"
                              checked={selectedSatisfaction === 3}
                              className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                              onChange={() => setSelectedSatisfaction(3)}
                              disabled={loading}
                            />
                            <label
                              htmlFor="3"
                              className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full py-1.5 text-xs font-medium"
                            >
                              <span className="px-2 py-1 rounded-md bg-blue-100">
                                <FaceSmileIcon className="h-4 w-4" />
                              </span>
                            </label>
                          </div>
                          <div className="flex items-center rounded-md border-solid border-gray-200 border px-2">
                            <input
                              id="4"
                              name="fulfillment"
                              type="radio"
                              value="4"
                              className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                              onChange={() => setSelectedSatisfaction(4)}
                              checked={selectedSatisfaction === 4}
                              disabled={loading}
                            />
                            <label
                              htmlFor="4"
                              className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full py-1.5 text-xs font-medium"
                            >
                              <span className="px-2 py-1 rounded-md bg-lime-100">
                                <FaceSmileIcon className="h-4 w-4" />
                              </span>
                            </label>
                          </div>
                          <div className="flex items-center rounded-md border-solid border-gray-200 border px-2">
                            <input
                              id="5"
                              name="fulfillment"
                              type="radio"
                              value="5"
                              className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                              onChange={() => setSelectedSatisfaction(5)}
                              checked={selectedSatisfaction === 5}
                              disabled={loading}
                            />
                            <label
                              htmlFor="5"
                              className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full py-1.5 text-xs font-medium"
                            >
                              <span className="px-2 py-1 rounded-md bg-lime-200">
                                <FaceSmileIcon className="h-4 w-4" />
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </fieldset>

                    <input
                      type="hidden"
                      name="satisfaction"
                      value={selectedSatisfaction}
                    />
                    {/* Emotion */}
                    <fieldset className="mt-2">
                      <legend className="mb-2 block text-sm font-medium">
                        {dict.forms?.expense.create.whatEmotionDidIFeel}
                      </legend>
                      <div className="pb-2 sm:max-w-[400px]">
                        <div className="flex gap-2 flex-wrap">
                          {emotions?.map((emotion) => (
                            <div className="flex items-center rounded-md border-solid border-gray-200 border px-2">
                              <input
                                id={emotion.name.toLocaleLowerCase()}
                                name="emotion"
                                type="radio"
                                className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                onChange={() => setSelectedEmotion(emotion.id)}
                                checked={selectedEmotion === emotion.id}
                                disabled={loading}
                              />
                              <label
                                htmlFor={emotion.name.toLocaleLowerCase()}
                                className={clsx(
                                  "ml-2 flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
                                )}
                              >
                                {
                                  dict.forms?.expense.create[
                                    emotion.name as keyof typeof dict.forms.expense.create
                                  ]
                                }{" "}
                                {emotion.emotionType === "negative" ? (
                                  <span className="px-2 py-1 rounded-md bg-red-200">
                                    <FaceFrownIcon className="h-4 w-4" />
                                  </span>
                                ) : (
                                  <span
                                    className={clsx("px-2 py-1 rounded-md", {
                                      "bg-lime-100":
                                        emotion.emotionType === "positive",
                                      "bg-blue-100":
                                        emotion.emotionType === "neutral",
                                    })}
                                  >
                                    <FaceSmileIcon className="h-4 w-4" />
                                  </span>
                                )}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>

                <input type="hidden" name="emotionId" value={selectedEmotion} />
              </div>
              {isPremium && (
                <div className="flex justify-end gap-4">
                  <CancelButton onClick={closeModal} />
                  <SubmitButton>{dict.forms?.shared.save}</SubmitButton>
                </div>
              )}
            </form>
          </div>
        </Modal>
      </>
    </>
  );
};
