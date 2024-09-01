"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { updateLastUpdated } from "../data/user";
import { createDbEarning, deleteDbEarning } from "../data/earning";
import { FormMessage } from "../types";

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
  categoryId: z
    .string({
      invalid_type_error: "Selecciona una categoría.",
    })
    .uuid({ message: "Selecciona una categoría." }),
  subCategoryId: z
    .string({
      invalid_type_error: "Selecciona una sub categoría.",
    })
    .optional(),
});

const CreateIncome = FormSchema.omit({ id: true });

export async function createIncome(
  prevState: IncomeFormState,
  formData: FormData
) {
  const session = await auth();
  const userId = session?.user?.id as string;

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
        text: "Database Error: Failed to Create Earning.",
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

export async function deleteIncome(incomeId: string) {
  const session = await auth();
  const userId = session?.user?.id as string;

  // If form validation fails, return errors early. Otherwise, continue.
  if (!incomeId) {
    return {
      errors: {},
      message: {
        text: "Database Error: incomeId not provided.",
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
        text: "Database Error: Failed to delete income.",
        type: "error",
      },
    };
  }

  revalidatePath("/dashboard");

  return {
    message: {
      text: "Earning deleted Successfully.",
      type: "success",
    },
  };
}
