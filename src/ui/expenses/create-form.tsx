"use client";

import {
  CurrencyDollarIcon,
  FaceSmileIcon,
  FaceFrownIcon,
} from "@heroicons/react/24/outline";
import { createExpense, ExpenseFormState } from "@/src/form-actions/expenses";
import { useActionState, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Emotion, ExpenseCategory } from "@/src/types";
import { toast, TypeOptions } from "react-toastify";
import { Dropdown, Modal, Spinner } from "../components";
import {
  CreateCategoryForm,
  CreateSubCategoryForm,
} from "../expense-categories";
import useSWR from "swr";
import { fetcher } from "@/src/utils/fetcher";
import { CancelButton, SubmitButton } from "../forms";
import clsx from "clsx";

export type CreateExpenseFormProps = {
  closeModal: () => void;
  emotions: Emotion[];
};

export const CreateExpenseForm = ({
  closeModal,
  emotions,
}: CreateExpenseFormProps) => {
  const initialState: ExpenseFormState = { message: {}, errors: {} };
  const [state, formAction, loading] = useActionState(
    createExpense,
    initialState
  );
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [startDate, setStartDate] = useState(new Date());
  const [subCategories, setSubCategories] = useState<
    { name: string; id: string }[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>();
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [isSubCategoryFormOpen, setIsSubCategoryFormOpen] = useState(false);
  const [selectedSatisfaction, setSelectedSatisfaction] = useState(3);
  const [selectedEmotion, setSelectedEmotion] = useState(9);

  const { data, mutate, isLoading } = useSWR(
    "/api/expense/category/get-all",
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    const loadedCategories = (data?.categories || []) as ExpenseCategory[];
    setCategories(loadedCategories);
    setSubCategories(
      loadedCategories.find((category) => category.id === selectedCategory)
        ?.subcategories || []
    );
  }, [data]);

  useEffect(() => {
    if (!isCategoryFormOpen && !isSubCategoryFormOpen && !isLoading) {
      mutate();
    }
  }, [isCategoryFormOpen, isSubCategoryFormOpen, isLoading]);

  useEffect(() => {
    if (state.message?.text) {
      toast(state.message.text, { type: state.message.type as TypeOptions });
    }
  }, [state]);

  return (
    <>
      <CreateCategoryForm
        isOpen={isCategoryFormOpen}
        closeModal={() => setIsCategoryFormOpen(false)}
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
                {/* Category */}
                <div className="mb-4">
                  <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-medium"
                  >
                    Categoría *
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
                      disabled={loading}
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
                      Sub Categoría
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
                        disabled={loading}
                      />
                      <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                    </div>
                    <div
                      id="amount-error"
                      aria-live="polite"
                      aria-atomic="true"
                    >
                      {state.errors?.amount &&
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
                    Fecha *
                  </label>
                  <div className="relative mt-2 rounded-md">
                    <div className="relative">
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date as Date)}
                        maxDate={new Date()}
                        aria-describedby="date-error"
                        className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                      />
                      <input
                        type="hidden"
                        name="date"
                        value={
                          startDate ? startDate.toISOString().split("T")[0] : ""
                        }
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

                {/* plenitud */}
                <fieldset>
                  <legend className="mb-2 block text-sm font-medium">
                    Nivel de satisfacción en proporción a este gasto
                  </legend>
                  <div className="rounded-md border border-gray-200 bg-white px-3 py-3">
                    <div className="flex gap-4 flex-col">
                      <div className="flex items-center">
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
                          className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-red-400 px-3 py-1.5 text-xs font-medium"
                        >
                          -- <FaceFrownIcon className="h-4 w-4" />
                        </label>
                      </div>
                      <div className="flex items-center">
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
                          className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-red-400 px-3 py-1.5 text-xs font-medium"
                        >
                          - <FaceFrownIcon className="h-4 w-4" />
                        </label>
                      </div>
                      <div className="flex items-center">
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
                          className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-blue-400 px-3 py-1.5 text-xs font-medium"
                        >
                          Ok <FaceSmileIcon className="h-4 w-4" />
                        </label>
                      </div>
                      <div className="flex items-center">
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
                          className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-400 px-3 py-1.5 text-xs font-medium"
                        >
                          + <FaceSmileIcon className="h-4 w-4" />
                        </label>
                      </div>
                      <div className="flex items-center">
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
                          className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-400 px-3 py-1.5 text-xs font-medium"
                        >
                          ++ <FaceSmileIcon className="h-4 w-4" />
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
                    ¿Qué emoción sentí al hacer este gasto?
                  </legend>
                  <div className="rounded-md border border-gray-200 bg-white px-3 py-3">
                    <div className="flex flex-col gap-4">
                      {emotions?.map((emotion) => (
                        <div className="flex items-center">
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
                              "ml-2 flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium",
                              {
                                "bg-red-400":
                                  emotion.emotionType === "negative",
                                "bg-green-400":
                                  emotion.emotionType === "positive",
                                "bg-blue-400":
                                  emotion.emotionType === "neutral",
                              }
                            )}
                          >
                            {emotion.name}{" "}
                            {emotion.emotionType === "negative" ? (
                              <FaceFrownIcon className="h-4 w-4" />
                            ) : (
                              <FaceSmileIcon className="h-4 w-4" />
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </fieldset>
                <input type="hidden" name="emotionId" value={selectedEmotion} />
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <CancelButton onClick={closeModal} />
                <SubmitButton text="Guardar" />
              </div>
            </form>
          </div>
        </Modal>
      </>
    </>
  );
};
