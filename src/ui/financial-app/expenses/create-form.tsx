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
};

export const CreateExpenseForm = ({
  closeModal,
  emotions,
  month,
}: CreateExpenseFormProps) => {
  const { dict, lang } = useTranslations();

  const createExpenseAction = createExpense.bind(null, lang);

  const { subscriptionDetails } = useContext(AppContext);
  const isPremium = subscriptionDetails?.isPremium;

  const initialState: ExpenseFormState = { message: {}, errors: {} };

  const { pending: loading } = useFormStatus();
  const [state, formAction] = useFormState(createExpenseAction, initialState);

  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const firstDayOfSelectedMonth = new Date(currentYear, month - 1, 1);
  const isCurrentMonth = month === currentMonth;
  const lastDayOfSelectedMonth = new Date(currentYear, month, 0); // Last day of the month
  const maxDate = isCurrentMonth ? new Date() : lastDayOfSelectedMonth;

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
    if (state.message?.type === "success") {
      setSelectedSatisfaction(3); // Reset to initial value
      setSelectedEmotion(9); // Reset to initial value
      setAmount("");
      setDescription("");
    }
  }, [state]);

  useEffect(() => {
    if (!showSubcategories) {
      setTimeout(() => {
        setShowSubcategories(true);
      }, 10);
    }
  }, [showSubcategories]);

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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(",", "."); // Normalize commas to dots
    if (!isNaN(Number(value)) || value === "") {
      setAmount(value);
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

                {/* Description */}
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium"
                  >
                    {dict.forms?.shared.description} *
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
                        className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                        required
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

                {/* Amount */}

                <div className="mb-4">
                  <label
                    htmlFor="amount"
                    className="mb-2 block text-sm font-medium"
                  >
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
                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                        required
                        aria-describedby="amount-error"
                        disabled={loading}
                      />
                      <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                    </div>
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
                </div>
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
                        className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500 z-[100001]"
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

                {!isPremium && (
                  <div className="flex justify-end gap-4 mb-4">
                    <CancelButton onClick={closeModal} />
                    <SubmitButton>{dict.forms?.shared.save}</SubmitButton>
                  </div>
                )}

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
                      <div className="py-3">
                        <div className="flex gap-4 flex-wrap">
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
                              --
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
                              -
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
                              Ok
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
                              +
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
                              ++
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
                    <fieldset className="mt-5">
                      <legend className="mb-2 block text-sm font-medium">
                        {dict.forms?.expense.create.whatEmotionDidIFeel}
                      </legend>
                      <div className="py-3 sm:max-w-[400px]">
                        <div className="flex gap-4 flex-wrap">
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
