"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

import { updateLastUpdated } from "../data/user";
import { deleteDbExpense, createDbExpense } from "../data/expenses";
import { FormMessage } from "../types";

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
    .uuid({ message: "Selecciona una sub categoría." }),
});

const CreateExpense = FormSchema.omit({ id: true });

export async function createExpense(
  prevState: ExpenseFormState,
  formData: FormData
) {
  const session = await auth();
  const userId = session?.user?.id as string;

  // Validate form using Zod
  const validatedFields = CreateExpense.safeParse({
    description: formData.get("description"),
    date: formData.get("date"),
    amount: formData.get("amount"),
    categoryId: formData.get("categoryId"),
    subCategoryId: formData.get("subCategoryId"),
    status: formData.get("status"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: {
        text: "Database Error: Failed to Create Expense.",
        type: "error",
      },
    };
  }

  // Prepare data for insertion into the database
  const { description, amount, date, categoryId, subCategoryId } =
    validatedFields.data;

  try {
    await createDbExpense({
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
        text: "Database Error: Failed to Create Expense.",
        type: "error",
      },
    };
  }
  revalidatePath("/dashboard");

  return {
    message: {
      text: "Gasto agregado exitosamente.",
      type: "success",
    },
  };
}

export async function deleteExpense(expenseId: string) {
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
        text: "Database Error: Failed to delete expense.",
        type: "error",
      },
    };
  }

  revalidatePath("/dashboard");

  return {
    message: {
      text: "Expense deleted Successfully.",
      type: "success",
    },
  };
}
