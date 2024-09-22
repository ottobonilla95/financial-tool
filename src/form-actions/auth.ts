"use server";

import { auth, signIn } from "@/auth";
import { AuthError } from "next-auth";
import { FormMessage } from "../types";
import { z } from "zod";
import { createDbUser, getDBUser, updateDBUser } from "../data/user";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export type AuthFormState = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export type CreateUserFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    currencyId?: string[];
    password?: string[];
    passwordConfirmation?: string[];
  };
} & FormMessage;

export type UpdatePasswordFormState = {
  errors?: {
    currentPassword?: string[];
    password?: string[];
    passwordConfirmation?: string[];
  };
  message?: {
    text?: string;
    type?: string;
  };
};

const FormSchema = z
  .object({
    name: z
      .string({
        invalid_type_error: "Agrega nombre.",
      })
      .min(1, { message: "El nombre no puede estar vacío." })
      .refine((value) => value.trim().length > 0, {
        message: "El nombre no debe estar vacío.",
      }),
    email: z
      .string({
        invalid_type_error: "Agrega email.",
      })
      .email({ message: "Formato de email inválido." })
      .min(1, { message: "El email no puede estar vacío." })
      .refine((value) => value.trim().length > 0, {
        message: "El email no debe estar vacío.",
      }),
    currencyId: z.string({
      invalid_type_error: "Selecciona una moneda.",
    }),
    password: z
      .string({
        invalid_type_error: "Agrega una contraseña.",
      })
      .min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
    passwordConfirmation: z
      .string({
        invalid_type_error: "Confirma tu contraseña.",
      })
      .min(6, {
        message:
          "La confirmación de la contraseña debe tener al menos 6 caracteres.",
      }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Las contraseñas no coinciden.",
    path: ["passwordConfirmation"],
  });

const UpdatePasswordFormSchema = z
  .object({
    currentPassword: z.string({
      invalid_type_error: "Agrega tu contraseña actual.",
    }),
    password: z
      .string({
        invalid_type_error: "Agrega una contraseña.",
      })
      .min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
    passwordConfirmation: z
      .string({
        invalid_type_error: "Confirma tu contraseña.",
      })
      .min(6, {
        message:
          "La confirmación de la contraseña debe tener al menos 6 caracteres.",
      }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Las contraseñas no coinciden.",
    path: ["passwordConfirmation"],
  });

const CreateUser = FormSchema;

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Credenciales inválidas.";
        default:
          return "Algo salió mal.";
      }
    }
    throw error;
  }
}

export async function createUser(
  prevState: CreateUserFormState,
  formData: FormData
) {
  const validatedFields = CreateUser.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    currencyId: formData.get("currencyId"),
    password: formData.get("password"),
    passwordConfirmation: formData.get("passwordConfirmation"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: {
        text: "Database Error: Failed to Create User.",
        type: "error",
      },
    };
  }

  // Prepare data for insertion into the database
  const { name, password, email, currencyId } = validatedFields.data;

  try {
    const user = await getDBUser({
      filters: {
        email,
      },
    });

    if (user) {
      return {
        message: {
          text: "User with this email already exists.",
          type: "error",
        },
      };
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await createDbUser({
      email,
      name,
      password: hashedPassword,
      currencyId,
    });

    await signIn("credentials", { email, password });
  } catch (error) {
    throw error;
  }
  redirect("/dashboard");
}

export async function updatePassword(
  prevState: UpdatePasswordFormState,
  formData: FormData
) {
  const session = await auth();
  const userId = session?.user?.id as string;

  // Validate form using Zod
  const validatedFields = UpdatePasswordFormSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    password: formData.get("password"),
    passwordConfirmation: formData.get("passwordConfirmation"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: {
        text: "Database Error: Error al actualizar Contraseña.",
        type: "error",
      },
    };
  }

  const { currentPassword, password } = validatedFields.data;

  try {
    const user = await getDBUser({
      filters: {
        id: userId,
      },
      select: {
        password: true,
      },
    });

    if (!user) {
      return {
        errors: {},
        message: {
          text: "Database Error: Usuario no encontrado.",
          type: "error",
        },
      };
    }

    const passwordsMatch = await bcrypt.compare(
      currentPassword,
      user.password as string
    );

    if (!passwordsMatch) {
      return {
        errors: {},
        message: {
          text: "Contraseña incorrecta.",
          type: "error",
        },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await updateDBUser({
      filters: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });
  } catch (error) {
    return {
      message: {
        text: "Database Error: Error al actualizar Contraseña.",
        type: "error",
      },
    };
  }

  return {
    message: {
      text: "Contraseña actualizada exitosamente.",
      type: "success",
    },
  };
}
