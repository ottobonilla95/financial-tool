"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { updateLastUpdated } from "../data/user";
import { createDbSaving, deleteDbSaving } from "../data/saving";
import { FormMessage } from "../types";

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

const FormSchema = z.object({
  id: z.string(),
  description: z
    .string({
      invalid_type_error: "Agrega una descripción.",
    })
    .min(1, { message: "La descripción no debe estar vacía." })
    .refine((value) => value.trim().length > 0, {
      message:
        "La descripción no debe estar vacía o contener solo espacios en blanco.",
    }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Ingresa una cantidad mayor a 0." }),
  date: z.string(),
});

const CreateSaving = FormSchema.omit({ id: true });

export async function createSaving(
  prevState: SavingFormState,
  formData: FormData
) {
  const session = await auth();
  const userId = session?.user?.id as string;

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
      description,
      date: new Date(date),
    });
    await updateLastUpdated({
      userId,
    });
  } catch (error) {
    return {
      message: {
        text: "Database Error: Failed to Create Saving.",
        type: "error",
      },
    };
  }
  revalidatePath("/dashboard");

  return {
    message: {
      text: "Ingreso agregado exitosamente.",
      type: "success",
    },
  };
}

export async function deleteSaving(savingId: string) {
  const session = await auth();
  const userId = session?.user?.id as string;

  // If form validation fails, return errors early. Otherwise, continue.
  if (!savingId) {
    return {
      errors: {},
      message: {
        text: "Database Error: savingId not provided.",
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
        text: "Database Error: Failed to delete saving.",
        type: "error",
      },
    };
  }

  revalidatePath("/dashboard");

  return {
    message: {
      text: "Saving deleted Successfully.",
      type: "success",
    },
  };
}
