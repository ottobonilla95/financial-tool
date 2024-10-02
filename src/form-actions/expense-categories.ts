"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { createDBCategory, updateDBCategory } from "../data/expense-category";
import {
  AppDictionary,
  AvailableLanguages,
  getDictionary,
} from "../translations";

export type CategoryFormState = {
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

export async function createCategory(
  lang: AvailableLanguages,
  prevState: CategoryFormState,
  formData: FormData
) {
  const dict = await getDictionary(lang);

  const session = await auth();
  const userId = session?.user?.id as string;

  const CreateCategory = createSchema(dict).omit({ id: true });

  // Validate form using Zod
  const validatedFields = CreateCategory.safeParse({
    name: formData.get("name"),
    color: formData.get("color"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: {
        text: "Database Error: Failed to Create Category.",
        type: "error",
      },
    };
  }

  const { color, name } = validatedFields.data;

  try {
    await createDBCategory({
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
export async function updateCategory(
  lang: AvailableLanguages,
  prevState: UpdateFormState,
  formData: FormData
) {
  const dict = await getDictionary(lang);

  const session = await auth();
  const userId = session?.user?.id as string;
  const UpdateCategory = createSchema(dict);

  // Validate form using Zod
  const validatedFields = UpdateCategory.safeParse({
    id: formData.get("categoryId"),
    name: formData.get("name"),
    color: formData.get("color"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: {
        text: "Database Error: Failed to Update Category.",
        type: "error",
      },
    };
  }

  const { id, color, name } = validatedFields.data;

  try {
    await updateDBCategory({
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
