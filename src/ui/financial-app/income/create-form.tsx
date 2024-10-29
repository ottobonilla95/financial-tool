"use client";

import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { createIncome, IncomeFormState } from "@/src/form-actions/income";
import { useEffect, useState } from "react";
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

export type CreateIncomeFormProps = {
  closeModal: () => void;
  month: number;
};

export const CreateIncomeForm = ({
  closeModal,
  month,
}: CreateIncomeFormProps) => {
  const initialState: IncomeFormState = { message: {}, errors: {} };
  const { lang, dict } = useTranslations();
  const createIncomeAction = createIncome.bind(null, lang);

  const [state, formAction] = useFormState(createIncomeAction, initialState);

  const [categories, setCategories] = useState<EarningCategory[]>([]);

  const currentYear = new Date().getFullYear();
  const [startDate, setStartDate] = useState(new Date(currentYear, month - 1));
  const [subCategories, setSubCategories] = useState<
    { name: string; id: string }[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>();
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [isSubCategoryFormOpen, setIsSubCategoryFormOpen] = useState(false);

  const {
    data,
    mutate: getAllCategories,
    isLoading,
  } = useSWR("/api/income/category/get-all", fetcher, {
    revalidateOnFocus: false,
  });

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
  }, [state]);

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
                    {dict.forms?.shared.description} *
                  </label>
                  <div className="relative mt-2 rounded-md">
                    <div className="relative">
                      <input
                        id="description"
                        name="description"
                        type="text"
                        step="0.01"
                        placeholder={dict.forms?.shared.enterDescription}
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
                        type="number"
                        step="0.01"
                        placeholder={dict.forms?.shared.enterAmount}
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
                        maxDate={new Date()}
                        dateFormat={"dd MMM yyyy"}
                        aria-describedby="date-error"
                        popperClassName="z-[1000000]"
                        calendarClassName="z-[1000000]"
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
                <SubmitButton>{dict.forms?.shared.save}</SubmitButton>
              </div>
            </form>
          </div>
        </Modal>
      </>
    </>
  );
};
