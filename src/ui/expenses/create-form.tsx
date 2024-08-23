"use client";

import {
  CurrencyDollarIcon,
  FaceSmileIcon,
  FaceFrownIcon,
} from "@heroicons/react/24/outline";
import { createExpense, ExpenseFormState } from "@/src/form-actions/expenses";
import { useActionState, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { ExpenseCategory } from "@/src/types";
import { toast, TypeOptions } from "react-toastify";
import { Dropdown, Spinner } from "../components";
import {
  CreateCategoryForm,
  CreateSubCategoryForm,
} from "../expense-categories";
import { Dialog, DialogPanel } from "@headlessui/react";
import useSWR from "swr";
import { fetcher } from "@/src/utils/fetcher";
import { CancelButton, SubmitButton } from "../forms";

export type CreateExpenseFormProps = {
  isOpen: boolean;
  closeModal: () => void;
};

export const CreateExpenseForm = ({
  isOpen,
  closeModal,
}: CreateExpenseFormProps) => {
  const initialState: ExpenseFormState = { message: {}, errors: {} };
  const [state, formAction] = useActionState(createExpense, initialState);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [startDate, setStartDate] = useState(new Date());
  const [subCategories, setSubCategories] = useState<
    { name: string; id: string }[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>();
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [isSubCategoryFormOpen, setIsSubCategoryFormOpen] = useState(false);
  const [selectedSatisfaction, setSelectedSatisfaction] = useState("ok");
  const [selectedEmotion, setSelectedEmotion] = useState("netral");
  const [selectedAlignedWithValues, setSelectedAlignedWithValues] =
    useState("ok");

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
        {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-40" />}
        <Dialog
          open={isOpen}
          onClose={closeModal}
          className="relative z-50 p-10"
        >
          <div className="fixed inset-0 flex w-screen items-center justify-center overflow-y-auto pt-[250px]">
            <DialogPanel className="max-w-lg border bg-white p-12 relative">
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
                        />
                      </div>
                      <div
                        id="description-error"
                        aria-live="polite"
                        aria-atomic="true"
                      >
                        {state?.errors?.description &&
                          state.errors.description.map((error: string) => (
                            <p
                              className="mt-2 text-sm text-red-500"
                              key={error}
                            >
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
                            <p
                              className="mt-2 text-sm text-red-500"
                              key={error}
                            >
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
                            startDate
                              ? startDate.toISOString().split("T")[0]
                              : ""
                          }
                        />
                      </div>
                      <div
                        id="date-error"
                        aria-live="polite"
                        aria-atomic="true"
                      >
                        {state?.errors?.date &&
                          state.errors.date.map((error: string) => (
                            <p
                              className="mt-2 text-sm text-red-500"
                              key={error}
                            >
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
                      <div className="flex gap-4">
                        <div className="flex items-center">
                          <input
                            id="minus"
                            name="fulfillment"
                            type="radio"
                            value="pending"
                            className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                            onChange={() => setSelectedSatisfaction("minus")}
                            checked={selectedSatisfaction === "minus"}
                          />
                          <label
                            htmlFor="minus"
                            className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-red-400 px-3 py-1.5 text-xs font-medium"
                          >
                            - <FaceFrownIcon className="h-4 w-4" />
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="ok"
                            name="fulfillment"
                            type="radio"
                            checked={selectedSatisfaction === "ok"}
                            className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                            onChange={() => setSelectedSatisfaction("ok")}
                          />
                          <label
                            htmlFor="ok"
                            className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-blue-400 px-3 py-1.5 text-xs font-medium"
                          >
                            Ok <FaceSmileIcon className="h-4 w-4" />
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="plus"
                            name="fulfillment"
                            type="radio"
                            value="paid"
                            className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                            onChange={() => setSelectedSatisfaction("plus")}
                            checked={selectedSatisfaction === "plus"}
                          />
                          <label
                            htmlFor="plus"
                            className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-400 px-3 py-1.5 text-xs font-medium"
                          >
                            + <FaceSmileIcon className="h-4 w-4" />
                          </label>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                  <div className="h-5" />
                  {/* valores */}
                  <fieldset>
                    <legend className="mb-2 block text-sm font-medium">
                      ¿Esta alineado con mis valores y propósito de vida?
                    </legend>
                    <div className="rounded-md border border-gray-200 bg-white px-3 py-3">
                      <div className="flex gap-4">
                        <div className="flex items-center">
                          <input
                            id="no"
                            name="alignedWithValues"
                            type="radio"
                            className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                            onChange={() => setSelectedAlignedWithValues("no")}
                            checked={selectedAlignedWithValues === "no"}
                          />
                          <label
                            htmlFor="no"
                            className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-red-400 px-3 py-1.5 text-xs font-medium"
                          >
                            No <FaceFrownIcon className="h-4 w-4" />
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="neutral"
                            name="alignedWithValues"
                            type="radio"
                            checked={selectedAlignedWithValues === "ok"}
                            className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                            onChange={() => setSelectedAlignedWithValues("ok")}
                          />
                          <label
                            htmlFor="neutral"
                            className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-blue-400 px-3 py-1.5 text-xs font-medium"
                          >
                            Ok <FaceSmileIcon className="h-4 w-4" />
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="si"
                            name="alignedWithValues"
                            type="radio"
                            className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                            onChange={() => setSelectedAlignedWithValues("si")}
                            checked={selectedAlignedWithValues === "si"}
                          />
                          <label
                            htmlFor="si"
                            className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-400 px-3 py-1.5 text-xs font-medium"
                          >
                            Si <FaceSmileIcon className="h-4 w-4" />
                          </label>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                  {/* Emotion */}
                  <fieldset className="mt-5">
                    <legend className="mb-2 block text-sm font-medium">
                      ¿Qué emoción sentí al hacer este gasto?
                    </legend>
                    <div className="rounded-md border border-gray-200 bg-white px-3 py-3">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center">
                          <input
                            id="sadness"
                            name="emotion"
                            type="radio"
                            className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                            onChange={() => setSelectedEmotion("sadness")}
                            checked={selectedEmotion === "sadness"}
                          />
                          <label
                            htmlFor="sadness"
                            className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-red-400 px-3 py-1.5 text-xs font-medium"
                          >
                            Tristeza <FaceFrownIcon className="h-4 w-4" />
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="anxiety"
                            name="emotion"
                            type="radio"
                            checked={selectedEmotion === "anxiety"}
                            className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                            onChange={() => setSelectedEmotion("anxiety")}
                          />
                          <label
                            htmlFor="anxiety"
                            className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-red-400 px-3 py-1.5 text-xs font-medium"
                          >
                            Ansiedad <FaceFrownIcon className="h-4 w-4" />
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="netral"
                            name="emotion"
                            type="radio"
                            checked={selectedEmotion === "netral"}
                            className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                            onChange={() => setSelectedEmotion("netral")}
                          />
                          <label
                            htmlFor="netral"
                            className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-blue-400 px-3 py-1.5 text-xs font-medium"
                          >
                            Indiferente <FaceSmileIcon className="h-4 w-4" />
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="happiness"
                            name="emotion"
                            type="radio"
                            className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                            onChange={() => setSelectedEmotion("happiness")}
                            checked={selectedEmotion === "happiness"}
                          />
                          <label
                            htmlFor="happiness"
                            className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-400 px-3 py-1.5 text-xs font-medium"
                          >
                            Alegría <FaceSmileIcon className="h-4 w-4" />
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="enthusiasm"
                            name="emotion"
                            type="radio"
                            className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                            onChange={() => setSelectedEmotion("enthusiasm")}
                            checked={selectedEmotion === "enthusiasm"}
                          />
                          <label
                            htmlFor="enthusiasm"
                            className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-400 px-3 py-1.5 text-xs font-medium"
                          >
                            Entusiasmo <FaceSmileIcon className="h-4 w-4" />
                          </label>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div className="mt-6 flex justify-end gap-4">
                  <CancelButton onClick={closeModal} />
                  <SubmitButton text="Guardar" />
                </div>
              </form>
            </DialogPanel>
          </div>
        </Dialog>
      </>
    </>
  );
};
