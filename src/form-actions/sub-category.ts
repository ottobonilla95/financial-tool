"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createDBSubCategory } from "../data/category";

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
  categoryId: z.string({
    invalid_type_error: "Agrega una categoria.",
  }),
});

const CreateInvoice = FormSchema;
// const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function createSubCategory(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
    name: formData.get("name"),
    categoryId: formData.get("categoryId"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: {
        text: "Database Error: Failed to Create sub Category.",
        type: "error",
      },
    };
  }

  const { name, categoryId } = validatedFields.data;

  try {
    await createDBSubCategory({
      name,
      categoryId,
    });
  } catch (error) {
    return {
      message: {
        text: "Database Error: Failed to Create  sub category.",
        type: "error",
      },
    };
  }

  revalidatePath("/dashboard/expenses/create");

  return {
    message: {
      text: "Sub Categoría creada exitosamente.",
      type: "success",
    },
  };
}
