"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { createDBCategory, updateDBCategory } from "../data/category";

export type State = {
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

const CreateCategory = FormSchema.omit({ id: true });
const UpdateCategory = FormSchema;
// const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function createCategory(prevState: State, formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id as string;

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
        text: "Database Error: Failed to Create category.",
        type: "error",
      },
    };
  }

  revalidatePath("/dashboard/expenses/create");

  return {
    message: {
      text: "Categoría creada exitosamente.",
      type: "success",
    },
  };
}
export async function updateCategory(prevState: State, formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id as string;

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
