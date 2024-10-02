"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { updateLastUpdated } from "../data/user";
import { deleteDbExpense, createDbExpense } from "../data/expenses";
import { FormMessage } from "../types";
import {
  AppDictionary,
  AvailableLanguages,
  getDictionary,
} from "../translations";

export type ExpenseFormState = {
  errors?: {
    description?: string[];
    amount?: string[];
    categoryId?: string[];
    subCategoryId?: string[];
    date?: string[];
  };
} & FormMessage;

export type DeleteFormState = {
  errors?: {};
} & FormMessage;

const createFormSchema = (dict: AppDictionary) =>
  z.object({
    id: z.string(),
    description: z
      .string({
        invalid_type_error: dict.api.shared.requiredField,
      })
      .min(1, { message: dict.api.shared.requiredField })
      .refine((value) => value.trim().length > 0, {
        message: dict.api.shared.requiredField,
      }),
    amount: z.coerce.number().gt(0, { message: dict.api.shared.requiredField }),
    date: z.string(),
    categoryId: z
      .string({
        invalid_type_error: dict.api.shared.requiredField,
      })
      .uuid({ message: dict.api.shared.requiredField }),
    subCategoryId: z
      .string({
        invalid_type_error: dict.api.shared.requiredField,
      })
      .optional(),
    satisfaction: z.string(),
    emotionId: z.string(),
  });

export async function createExpense(
  lang: AvailableLanguages,
  prevState: ExpenseFormState,
  formData: FormData
) {
  const dict = await getDictionary(lang);

  const session = await auth();
  const userId = session?.user?.id as string;

  const CreateExpense = createFormSchema(dict).omit({ id: true });

  // Validate form using Zod
  const validatedFields = CreateExpense.safeParse({
    description: formData.get("description"),
    date: formData.get("date"),
    amount: formData.get("amount"),
    categoryId: formData.get("categoryId"),
    subCategoryId: formData.get("subCategoryId"),
    satisfaction: formData.get("satisfaction"),
    emotionId: formData.get("emotionId"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Prepare data for insertion into the database
  const {
    description,
    amount,
    date,
    categoryId,
    subCategoryId,
    satisfaction,
    emotionId,
  } = validatedFields.data;

  try {
    await createDbExpense({
      userId,
      amount,
      categoryId,
      subCategoryId,
      description,
      date: new Date(date),
      satisfaction: Number(satisfaction),
      emotionId: Number(emotionId),
    });

    await updateLastUpdated({
      userId,
    });
  } catch (error) {
    return {
      message: {
        text: dict.api.expenses.create.error,
        type: "error",
      },
    };
  }
  revalidatePath("/dashboard");

  return {
    message: {
      text: dict.api.expenses.create.success,
      type: "success",
    },
  };
}

export async function deleteExpense(
  expenseId: string,
  lang: AvailableLanguages
) {
  const dict = await getDictionary(lang);

  const session = await auth();
  const userId = session?.user?.id as string;

  // If form validation fails, return errors early. Otherwise, continue.
  if (!expenseId) {
    return {
      errors: {},
      message: {
        text: "Database Error: expenseId not provided.",
        type: "error",
      },
    };
  }

  try {
    await deleteDbExpense({
      userId,
      expenseId: expenseId,
    });
    await updateLastUpdated({
      userId,
    });
  } catch (error) {
    return {
      message: {
        text: dict.api.expenses.delete.error,
        type: "error",
      },
    };
  }

  revalidatePath("/dashboard");

  return {
    message: {
      text: dict.api.expenses.delete.success,
      type: "success",
    },
  };
}
