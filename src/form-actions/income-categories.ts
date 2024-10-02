"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  createDBIncomeCategory,
  updateDBIncomeCategory,
} from "../data/income-category";
import {
  AppDictionary,
  AvailableLanguages,
  getDictionary,
} from "../translations";

export type IncomeCategoryFormState = {
  errors?: {
    name?: string[];
    color?: string[];
  };
  message?: {
    text?: string;
    type?: string;
  };
};

export type UpdateFormState = {
  errors?: {
    name?: string[];
    color?: string[];
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
    color: z.string({
      invalid_type_error: dict.api.shared.requiredField,
    }),
  });

export async function createIncomeCategory(
  lang: AvailableLanguages,
  prevState: IncomeCategoryFormState,
  formData: FormData
) {
  const dict = await getDictionary(lang);

  const session = await auth();
  const userId = session?.user?.id as string;

  const CreateIncomeCategory = createSchema(dict).omit({ id: true });

  // Validate form using Zod
  const validatedFields = CreateIncomeCategory.safeParse({
    name: formData.get("name"),
    color: formData.get("color"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: {
        text: dict.api.category.create.error,
        type: "error",
      },
    };
  }

  const { color, name } = validatedFields.data;

  try {
    await createDBIncomeCategory({
      userId,
      name,
      color,
    });
  } catch (error) {
    return {
      message: {
        text: dict.api.category.create.error,
        type: "error",
      },
    };
  }

  return {
    message: {
      text: dict.api.category.create.success,
      type: "success",
    },
  };
}
export async function updateIncomeCategory(
  lang: AvailableLanguages,
  prevState: UpdateFormState,
  formData: FormData
) {
  const dict = await getDictionary(lang);

  const session = await auth();
  const userId = session?.user?.id as string;
  const UpdateIncomeCategory = createSchema(dict);

  // Validate form using Zod
  const validatedFields = UpdateIncomeCategory.safeParse({
    id: formData.get("categoryId"),
    name: formData.get("name"),
    color: formData.get("color"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: {
        text: dict.api.category.update.error,
        type: "error",
      },
    };
  }

  const { id, color, name } = validatedFields.data;

  try {
    await updateDBIncomeCategory({
      id,
      userId,
      name,
      color,
    });
  } catch (error) {
    return {
      message: {
        text: dict.api.category.update.error,
        type: "error",
      },
    };
  }

  revalidatePath("/dashboard");

  return {
    message: {
      text: dict.api.category.update.success,
      type: "success",
    },
  };
}
