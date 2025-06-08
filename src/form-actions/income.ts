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
import { updateDbEarning } from "../data/earning/update-earning";

export type IncomeFormState = {
  errors?: {
    description?: string[];
    amount?: string[];
    categoryId?: string[];
    subCategoryId?: string[];
    date?: string[];
    currencyId?: string[];
  };
} & FormMessage;

export type UpdateIncomeFormState = {
  errors?: {
    description?: string[];
    amount?: string[];
    categoryId?: string[];
    subCategoryId?: string[];
    date?: string[];
    currencyId?: string[];
    originalAmount?: string[];
    exchangeRate?: string[];
  };
} & FormMessage;

export type DeleteFormState = {
  errors?: {};
} & FormMessage;

const incomeFormSchema = (dict: AppDictionary) =>
  z.object({
    id: z.string(),
    description: z
      .string({
        invalid_type_error: dict.api.shared.requiredField,
      })
      .optional(),
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
    currencyId: z.string().optional(),
    originalAmount: z.string().optional(),
    exchangeRate: z.string().optional(),
  });

export async function createIncome(
  lang: AvailableLanguages,
  prevState: IncomeFormState,
  formData: FormData
) {
  const dict = await getDictionary(lang);

  const session = await auth();
  const userId = session?.user?.id as string;

  const CreateIncome = incomeFormSchema(dict).omit({ id: true });

  // Validate form using Zod
  const validatedFields = CreateIncome.safeParse({
    description: formData.get("description"),
    date: formData.get("date"),
    amount: formData.get("amount"),
    categoryId: formData.get("categoryId"),
    subCategoryId: formData.get("subCategoryId"),
    currencyId: formData.get("currencyId"),
    originalAmount: formData.get("originalAmount"),
    exchangeRate: formData.get("exchangeRate"),
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
    currencyId,
    originalAmount,
    exchangeRate,
  } = validatedFields.data;

  // Get the converted amount if it exists (happens when user selects a different currency)
  const convertedAmount = formData.get("convertedAmount");

  // Use the converted amount if it exists, otherwise use the original amount
  const finalAmount = convertedAmount ? Number(convertedAmount) : amount;

  try {
    await createDbEarning({
      userId,
      amount: finalAmount,
      categoryId,
      subCategoryId,
      description: description || "",
      date: new Date(date),
      currencyId: currencyId ? Number(currencyId) : undefined,
      originalAmount: originalAmount ? Number(originalAmount) : undefined,
      exchangeRate: exchangeRate ? Number(exchangeRate) : undefined,
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

export async function updateIncome(
  earningId: string,
  lang: AvailableLanguages,
  prevState: UpdateIncomeFormState,
  formData: FormData
) {
  const dict = await getDictionary(lang);

  const session = await auth();
  const userId = session?.user?.id as string;

  const UpdateIncome = incomeFormSchema(dict).omit({ id: true });

  // Validate form using Zod
  const validatedFields = UpdateIncome.safeParse({
    description: formData.get("description"),
    date: formData.get("date"),
    amount: formData.get("amount"),
    categoryId: formData.get("categoryId"),
    subCategoryId: formData.get("subCategoryId"),
    currencyId: formData.get("currencyId"),
    originalAmount: formData.get("originalAmount"),
    exchangeRate: formData.get("exchangeRate"),
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
    currencyId,
    originalAmount,
    exchangeRate,
  } = validatedFields.data;

  // Get the converted amount if it exists (happens when user selects a different currency)
  const convertedAmount = formData.get("convertedAmount");

  // Use the converted amount if it exists, otherwise use the original amount
  const finalAmount = convertedAmount ? Number(convertedAmount) : amount;

  try {
    await updateDbEarning({
      id: earningId,
      userId,
      amount: finalAmount,
      categoryId,
      subCategoryId,
      description: description || "",
      date: new Date(date),
      currencyId: currencyId ? Number(currencyId) : undefined,
      originalAmount: originalAmount ? Number(originalAmount) : undefined,
      exchangeRate: exchangeRate ? Number(exchangeRate) : undefined,
    });
    await updateLastUpdated({
      userId,
    });
  } catch (error) {
    return {
      message: {
        text: dict.api.income.update.error,
        type: "error",
      },
    };
  }
  revalidatePath("/dashboard");

  return {
    message: {
      text: dict.api.income.update.success,
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
