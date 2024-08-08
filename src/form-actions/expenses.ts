"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createDbExpense } from "../data/expenses/create-expense";

export type State = {
  errors?: {
    description?: string[];
    amount?: string[];
    categoryId?: string[];
    subCategoryId?: string[];
    date?: string[];
  };
  message?: {
    text?: string;
    type?: string;
  };
};

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

const CreateInvoice = FormSchema.omit({ id: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function createExpense(prevState: State, formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id as string;

  // Validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
    description: formData.get("description"),
    date: formData.get("date"),
    amount: formData.get("amount"),
    categoryId: formData.get("categoryId"),
    subCategoryId: formData.get("subCategoryId"),
    status: formData.get("status"),
  });

  console.log({
    description: formData.get("description"),
    date: formData.get("date"),
    amount: formData.get("amount"),
    categoryId: formData.get("categoryId"),
    subCategoryId: formData.get("subCategoryId"),
    status: formData.get("status"),
  });
  console.log(validatedFields);
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: {
        text: "Database Error: Failed to Create Invoice.",
        type: "error",
      },
    };
  }

  // Prepare data for insertion into the database
  const { description, amount, date, categoryId, subCategoryId } =
    validatedFields.data;
  const amountInCents = amount * 100;

  // Insert data into the database
  try {
    await createDbExpense({
      userId,
      amount: amountInCents,
      categoryId,
      subCategoryId,
      description,
      date: new Date(date),
    });
  } catch (error) {
    return {
      message: {
        text: "Database Error: Failed to Create Invoice.",
        type: "error",
      },
    };
  }

  return {
    message: {
      text: "Invoice Created Successfully.",
      type: "success",
    },
  };
}

// export async function updateExpense(
//   id: string,
//   prevState: State,
//   formData: FormData
// ) {
//   const validatedFields = UpdateInvoice.safeParse({
//     customerId: formData.get("customerId"),
//     amount: formData.get("amount"),
//     status: formData.get("status"),
//   });

//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: "Missing Fields. Failed to Update Invoice.",
//     };
//   }

//   const { customerId, amount, status } = validatedFields.data;
//   const amountInCents = amount * 100;

//   try {
//     await sql`
//       UPDATE invoices
//       SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
//       WHERE id = ${id}
//     `;
//   } catch (error) {
//     return { message: "Database Error: Failed to Update Invoice." };
//   }

//   revalidatePath("/dashboard/invoices");
//   redirect("/dashboard/invoices");
// }

// export async function deleteExpense(id: string) {
//   try {
//     await sql`DELETE FROM invoices WHERE id = ${id}`;
//     revalidatePath("/dashboard/invoices");
//     return { message: "Deleted Invoice." };
//   } catch (error) {
//     return { message: "Database Error: Failed to Delete Invoice." };
//   }
// }
