"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { createDBCategory } from "../data/category";

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
  name: z.string({
    invalid_type_error: "Agrega un nombre.",
  }),
  color: z.string({
    invalid_type_error: "Selecciona un color.",
  }),
});

const CreateInvoice = FormSchema;
// const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function createCategory(prevState: State, formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id as string;

  // Validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
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
