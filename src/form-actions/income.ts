"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { updateLastUpdated } from "../data/user";
import { createDbEarning, deleteDbEarning } from "../data/earning";
import { FormMessage } from "../types";
import {
  AppDictionary,
  AvailableLanguages,
  getDictionary,
} from "../translations";

export type IncomeFormState = {
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

const createSchema = (dict: AppDictionary) =>
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
  });

export async function createIncome(
  lang: AvailableLanguages,
  prevState: IncomeFormState,
  formData: FormData
) {
  const dict = await getDictionary(lang);

  const session = await auth();
  const userId = session?.user?.id as string;

  const CreateIncome = createSchema(dict).omit({ id: true });

  // Validate form using Zod
  const validatedFields = CreateIncome.safeParse({
    description: formData.get("description"),
    date: formData.get("date"),
    amount: formData.get("amount"),
    categoryId: formData.get("categoryId"),
    subCategoryId: formData.get("subCategoryId"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Prepare data for insertion into the database
  const { description, amount, date, categoryId, subCategoryId } =
    validatedFields.data;

  try {
    await createDbEarning({
      userId,
      amount,
      categoryId,
      subCategoryId,
      description,
      date: new Date(date),
    });
    await updateLastUpdated({
      userId,
    });
  } catch (error) {
    return {
      message: {
        text: dict.api.income.create.error,
        type: "error",
      },
    };
  }
  revalidatePath("/dashboard");

  return {
    message: {
      text: dict.api.income.create.success,
      type: "success",
    },
  };
}

export async function deleteIncome(incomeId: string, lang: AvailableLanguages) {
  const dict = await getDictionary(lang);

  const session = await auth();
  const userId = session?.user?.id as string;

  // If form validation fails, return errors early. Otherwise, continue.
  if (!incomeId) {
    return {
      errors: {},
      message: {
        text: dict.api.income.delete.error,
        type: "error",
      },
    };
  }

  try {
    await deleteDbEarning({
      userId,
      incomeId: incomeId,
    });
    await updateLastUpdated({
      userId,
    });
  } catch (error) {
    return {
      message: {
        text: dict.api.income.delete.error,
        type: "error",
      },
    };
  }

  revalidatePath("/dashboard");

  return {
    message: {
      text: dict.api.income.delete.success,
      type: "success",
    },
  };
}
