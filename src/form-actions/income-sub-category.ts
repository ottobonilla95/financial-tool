"use server";

import { z } from "zod";
import { createDBIncomeSubCategory } from "../data/income-category";
import {
  AppDictionary,
  AvailableLanguages,
  getDictionary,
} from "../translations";

export type IncomeSubCategoryFormState = {
  errors?: {
    name?: string[];
    categoryId?: string[];
  };
  message?: {
    text?: string;
    type?: string;
  };
};

const createSchema = (dict: AppDictionary) =>
  z.object({
    id: z.string(),
    name: z.string({
      invalid_type_error: dict.api.shared.requiredField,
    }),
    categoryId: z.string({
      invalid_type_error: dict.api.shared.requiredField,
    }),
  });

export async function createIncomeSubCategory(
  lang: AvailableLanguages,
  prevState: IncomeSubCategoryFormState,
  formData: FormData
) {
  const dict = await getDictionary(lang);

  const CreateIncomeSubCategory = createSchema(dict).omit({ id: true });

  // Validate form using Zod
  const validatedFields = CreateIncomeSubCategory.safeParse({
    name: formData.get("name"),
    categoryId: formData.get("categoryId"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: {
        text: dict.api.subCategory.create.error,
        type: "error",
      },
    };
  }

  const { name, categoryId } = validatedFields.data;

  try {
    await createDBIncomeSubCategory({
      name,
      categoryId,
    });
  } catch (error) {
    return {
      message: {
        text: dict.api.subCategory.create.error,
        type: "error",
      },
    };
  }

  return {
    message: {
      text: dict.api.subCategory.create.success,
      type: "success",
    },
  };
}
