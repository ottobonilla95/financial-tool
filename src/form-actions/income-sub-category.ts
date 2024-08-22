"use server";

import { z } from "zod";
import { createDBIncomeSubCategory } from "../data/income-category";

export type IncomeSubCategoryFormState = {
  errors?: {
    name?: string[];
    categoryId?: string[];
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
  categoryId: z.string({
    invalid_type_error: "Agrega una categoria.",
  }),
});

const CreateIncomeSubCategory = FormSchema.omit({ id: true });

export async function createIncomeSubCategory(
  prevState: IncomeSubCategoryFormState,
  formData: FormData
) {
  // Validate form using Zod
  const validatedFields = CreateIncomeSubCategory.safeParse({
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
    await createDBIncomeSubCategory({
      name,
      categoryId,
    });
  } catch (error) {
    return {
      message: {
        text: "Database Error: Failed to Create sub category.",
        type: "error",
      },
    };
  }

  return {
    message: {
      text: "Sub Categoría creada exitosamente.",
      type: "success",
    },
  };
}
