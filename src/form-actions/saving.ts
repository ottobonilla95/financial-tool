"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { updateLastUpdated } from "../data/user";
import { createDbSaving, deleteDbSaving } from "../data/saving";
import { FormMessage } from "../types";
import {
  AppDictionary,
  AvailableLanguages,
  getDictionary,
} from "../translations";

export type SavingFormState = {
  errors?: {
    description?: string[];
    amount?: string[];
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
      .optional(),
    amount: z.coerce.number().gt(0, { message: dict.api.shared.requiredField }),
    date: z.string(),
  });

export async function createSaving(
  lang: AvailableLanguages,
  prevState: SavingFormState,
  formData: FormData
) {
  const dict = await getDictionary(lang);

  const session = await auth();
  const userId = session?.user?.id as string;

  const CreateSaving = createSchema(dict).omit({ id: true });
  // Validate form using Zod
  const validatedFields = CreateSaving.safeParse({
    description: formData.get("description"),
    date: formData.get("date"),
    amount: formData.get("amount"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { description, amount, date } = validatedFields.data;

  try {
    await createDbSaving({
      userId,
      amount,
      description: description || "",
      date: new Date(date),
    });
    await updateLastUpdated({
      userId,
    });
  } catch (error) {
    return {
      message: {
        text: dict.api.savings.create.error,
        type: "error",
      },
    };
  }
  revalidatePath("/dashboard");

  return {
    message: {
      text: dict.api.savings.create.success,
      type: "success",
    },
  };
}

export async function deleteSaving(savingId: string, lang: AvailableLanguages) {
  const dict = await getDictionary(lang);

  const session = await auth();
  const userId = session?.user?.id as string;

  // If form validation fails, return errors early. Otherwise, continue.
  if (!savingId) {
    return {
      errors: {},
      message: {
        text: dict.api.savings.delete.error,
        type: "error",
      },
    };
  }

  try {
    await deleteDbSaving({
      userId,
      savingId: savingId,
    });
    await updateLastUpdated({
      userId,
    });
  } catch (error) {
    return {
      message: {
        text: dict.api.savings.delete.error,
        type: "error",
      },
    };
  }

  revalidatePath("/dashboard");

  return {
    message: {
      text: dict.api.savings.delete.success,
      type: "success",
    },
  };
}
