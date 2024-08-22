"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { createDBIncomeCategory, updateDBIncomeCategory } from "../data/income-category";

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

const FormSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: "Agrega un nombre.",
  }),
  color: z.string({
    invalid_type_error: "Selecciona un color.",
  }),
});

const CreateIncomeCategory = FormSchema.omit({ id: true });
const UpdateIncomeCategory = FormSchema;

export async function createIncomeCategory(
  prevState: IncomeCategoryFormState,
  formData: FormData
) {
  const session = await auth();
  const userId = session?.user?.id as string;

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
        text: "Database Error: Failed to Create IncomeCategory.",
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
        text: "Database Error: Failed to Create category.",
        type: "error",
      },
    };
  }

  return {
    message: {
      text: "Categoría creada exitosamente.",
      type: "success",
    },
  };
}
export async function updateIncomeCategory(
  prevState: UpdateFormState,
  formData: FormData
) {
  const session = await auth();
  const userId = session?.user?.id as string;

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
        text: "Database Error: Failed to Update IncomeCategory.",
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
        text: "Database Error: Failed to update category.",
        type: "error",
      },
    };
  }

  revalidatePath("/dashboard");

  return {
    message: {
      text: "Categoría actualizada exitosamente.",
      type: "success",
    },
  };
}
