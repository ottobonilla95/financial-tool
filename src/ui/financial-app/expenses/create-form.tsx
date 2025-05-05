"use client";

import {
  CurrencyDollarIcon,
  FaceSmileIcon,
  FaceFrownIcon,
} from "@heroicons/react/24/outline";
import { createExpense, ExpenseFormState } from "@/src/form-actions/expenses";
import { useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Emotion, ExpenseCategory, ExpenseSubCategory } from "@/src/types";
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

export type CreateExpenseFormProps = {
  closeModal: () => void;
  emotions: Emotion[];
  month: number;
  year?: number;
};

export const CreateExpenseForm = ({
  closeModal,
  emotions,
  month,
  year,
}: CreateExpenseFormProps) => {
  const { dict, lang } = useTranslations();

  const createExpenseAction = createExpense.bind(null, lang);

  const { subscriptionDetails, currency, allCurrencies } =
    useContext(AppContext);
  const isPremium = subscriptionDetails?.isPremium;

  const initialState: ExpenseFormState = { message: {}, errors: {} };

  const { pending: loading } = useFormStatus();
  const [state, formAction] = useFormState(createExpenseAction, initialState);

  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
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

  const [selectedSatisfaction, setSelectedSatisfaction] = useState(3);
  const [selectedEmotion, setSelectedEmotion] = useState(9);
  const [shoMaxCategoriesAdded, setShowMaxCategoriesAdded] = useState(false);
  const [showSubcategories, setShowSubcategories] = useState(true);
  const [showCategories, setShowCategories] = useState(true);
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // Currency related state
  const [selectedCurrency, setSelectedCurrency] = useState<string>();
  const [exchangeRate, setExchangeRate] = useState<number | undefined>();
  const [convertedAmount, setConvertedAmount] = useState<string>("");
  const [originalForeignAmount, setOriginalForeignAmount] =
    useState<string>("");

  // Add useEffect to trigger animation on converted amount change
  const [showAnimation, setShowAnimation] = useState(false);

  const {
    data,
    mutate: getAllCategories,
    isLoading,
  } = useSWR("/api/expense/category/get-all", fetcher, {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    // Set default currency when component loads
    if (currency && !selectedCurrency) {
      setSelectedCurrency(currency.id.toString());
    }
  }, [currency, selectedCurrency]);

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
    if (state.message?.type === "success") {
      setSelectedSatisfaction(3); // Reset to initial value
      setSelectedEmotion(9); // Reset to initial value
      setAmount("");
      setDescription("");
      setSelectedCurrency(undefined);
      setOriginalForeignAmount("");
      setExchangeRate(undefined);
      setConvertedAmount("");
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
    if (convertedAmount) {
      setShowAnimation(true);
      const timer = setTimeout(() => {
        setShowAnimation(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [convertedAmount]);

  // Mock API call for exchange rate - will be replaced with real API later
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
    const fromCurrencyCode = allCurrencies.find(
      (c) => c.id.toString() === currencyId
    )?.currencyCode;

    // If currency is changed to user's default or is cleared, reset exchange rate and converted amount
    if (!currencyId || (currency && currencyId === currency.id.toString())) {
      setExchangeRate(undefined);
      setConvertedAmount("");
      setOriginalForeignAmount("");
    } else if (currency && fromCurrencyCode && currency.currencyCode) {
      // Single source of truth for exchange rate fetching in the component
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
        // We don't change the amount field here, just show the converted value
      }
    }
  };

  // Update converted amount when amount changes in a non-default currency
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

  const categoriesCount = categories.length;

  const onAddNewCategoryPressed = () => {
    if (!isPremium) {
      if (categoriesCount < MAX_CATEGORIES_FREE_PLAN) {
        setIsCategoryFormOpen(true);
      } else {
        setShowMaxCategoriesAdded(true);
      }
    } else {
      setIsCategoryFormOpen(true);
    }
  };

  return (
    <>
      <Modal
        isOpen={shoMaxCategoriesAdded}
        className="p-10"
        modalClassName="sm:max-w-[400px]"
        zIndex={60}
      >
        <div className="font-bold text-lg mb-2">
          {
            dict.shared?.subscriptionMessages
              .youHaveReaachedYourCategoryLimitTitle
          }
        </div>
        <div className="mb-5">
          {dict.shared?.subscriptionMessages.youHaveReaachedYourCategoryLimit}
        </div>
        <div className="flex gap-4">
          <Button onClick={() => setShowMaxCategoriesAdded(false)}>
            {dict.shared?.close}
          </Button>

          <div className="w-full">
            {subscriptionDetails?.isUserOnStripe ? (
              <Button
                href={subscriptionDetails.stripeCustomerPortalLink}
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
      </Modal>
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
                        // maxDate={maxDate}
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
                        value={startDate ? formatDateToLocal(startDate) : ""}
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
                        options={allCurrencies.map((c) => ({
                          value: c.id.toString(),
                          label: `${c.symbol} ${c.currencyCode}`,
                        }))}
                        onChange={(option) =>
                          handleCurrencyChange(option?.value)
                        }
                        defaultValue={
                          currency
                            ? {
                                value: currency.id.toString(),
                                label: `${currency.symbol} ${currency.currencyCode}`,
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
                  <div id="amount-error" aria-live="polite" aria-atomic="true">
                    {state?.errors?.amount &&
                      state.errors.amount.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                      ))}
                  </div>
                </div>
                {/* Add hidden field for actual amount to save (converted amount) */}

                <input
                  type="hidden"
                  name="convertedAmount"
                  value={convertedAmount}
                />

                {/* Add hidden field for original amount in foreign currency if applicable */}

                <input type="hidden" name="originalAmount" value={amount} />

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
                        onAddNewClick={() => onAddNewCategoryPressed()}
                        disabled={loading}
                        onEditClick={(value) => {
                          setCategoryToUpdate(
                            categories.find((c) => c.id === value)!
                          );
                          setIsUpdateCategoryModalOpen(true);
                        }}
                        showEditButton
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
                {/* Add hidden field for exchange rate only if we have one */}

                <input type="hidden" name="exchangeRate" value={exchangeRate} />
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
