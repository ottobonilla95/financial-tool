"use server";

import { auth, signIn } from "@/auth";
import { AuthError } from "next-auth";
import { FormMessage, User } from "../types";
import { z } from "zod";
import { createDbUser, getDBUser, updateDBUser } from "../data/user";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import {
  AppDictionary,
  AvailableLanguages,
  getDictionary,
} from "../translations";
import axios from "axios";

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
    email?: string[];
  };
} & FormMessage;

export type ComleteUserCreationUserFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    currencyId?: string[];
    password?: string[];
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

const createSchema = (dict: AppDictionary) =>
  z.object({
    email: z
      .string({
        invalid_type_error: dict.api.shared.requiredField,
      })
      .email({ message: dict.api.shared.invalidEmail })
      .min(1, { message: dict.api.shared.requiredField })
      .refine((value) => value.trim().length > 0, {
        message: dict.api.shared.requiredField,
      }),
  });

const completeCreationSchema = (dict: AppDictionary) =>
  z.object({
    name: z
      .string({
        invalid_type_error: dict.api.shared.requiredField,
      })
      .min(1, { message: dict.api.shared.requiredField })
      .refine((value) => value.trim().length > 0, {
        message: dict.api.shared.requiredField,
      }),
    email: z
      .string({
        invalid_type_error: dict.api.shared.requiredField,
      })
      .email({ message: dict.api.shared.invalidEmail })
      .min(1, { message: dict.api.shared.requiredField })
      .refine((value) => value.trim().length > 0, {
        message: dict.api.shared.requiredField,
      }),
    currencyId: z.string({
      invalid_type_error: dict.api.shared.requiredField,
    }),
    password: z
      .string({
        invalid_type_error: dict.api.shared.requiredField,
      })
      .min(6, { message: dict.api.shared.passwordShouldHaveAtLeast6Chars }),
  });

const createUpdatePasswordFormSchema = (dict: AppDictionary) =>
  z
    .object({
      currentPassword: z.string({
        invalid_type_error: dict.api.shared.requiredField,
      }),
      password: z
        .string({
          invalid_type_error: dict.api.shared.requiredField,
        })
        .min(6, { message: dict.api.shared.passwordShouldHaveAtLeast6Chars }),
      passwordConfirmation: z.string({
        invalid_type_error: dict.api.shared.requiredField,
      }),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: dict.api.shared.passwordsDontMatch,
      path: ["passwordConfirmation"],
    });

export async function authenticate(
  lang: AvailableLanguages,
  prevState: string | undefined,
  formData: FormData
) {
  const dict = await getDictionary(lang);

  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return dict.api.auth.invalidCredentials;
        default:
          return dict.api.shared.somethingWentWrong;
      }
    }
    throw error;
  }
}

export async function createUser(
  lang: AvailableLanguages,
  prevState: CreateUserFormState,
  formData: FormData
) {
  const dict = await getDictionary(lang);

  const CreateUser = createSchema(dict);

  const validatedFields = CreateUser.safeParse({
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: {
        text: dict.api.user.create.error,
        type: "error",
      },
    };
  }

  // Prepare data for insertion into the database
  const { email } = validatedFields.data;

  // 1. see if user exists on system io

  try {
    const getUserByEmailOptions = {
      method: "GET",
      url: `https://api.systeme.io/api/contacts?email=${email}`,
      headers: {
        accept: "application/json",
        "X-API-Key": process.env.SYSTEME_API_KEY,
      },
    };

    const userFoundResponse = await axios.request(getUserByEmailOptions);

    const userFound = userFoundResponse.data.items.length > 0;

    let contactId;

    if (userFound) {
      contactId = userFoundResponse.data.items[0].id;
    } else {
      const createUserOptions = {
        method: "POST",
        url: "https://api.systeme.io/api/contacts",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "X-API-Key": process.env.SYSTEME_API_KEY,
        },
        data: { email },
      };

      const response = await axios.request(createUserOptions);
      contactId = response.data.id;
    }

    const addTagOptions = {
      method: "POST",
      url: `https://api.systeme.io/api/contacts/${contactId}/tags`,
      headers: {
        "content-type": "application/json",
        "X-API-Key": process.env.SYSTEME_API_KEY,
      },
      data: { tagId: Number(process.env.SYSTEME_TRACKMYSPEND_TAG_ID) },
    };

    await axios.request(addTagOptions);

    const add2TagOptions = {
      method: "POST",
      url: `https://api.systeme.io/api/contacts/${contactId}/tags`,
      headers: {
        "content-type": "application/json",
        "X-API-Key": process.env.SYSTEME_API_KEY,
      },
      data: {
        tagId: Number(process.env.SYSTEME_TRACKMYSPEND_NOT_SUBSCRIBED_TAG_ID),
      },
    };

    await axios.request(add2TagOptions);
  } catch (ex) {
    console.log(ex);
  }

  try {
    const user = await getDBUser({
      filters: {
        email,
      },
    });

    if (user) {
      if (user.fullySignedUp) {
        redirect(`/login?email=${email}`);
      }
      redirect(`/pricing?email=${email}`);
    }

    await createDbUser({
      email,
      lang,
    });

    redirect(`/pricing?email=${email}`);
  } catch (error) {
    throw error;
  }
}
export async function completeUserCreation(
  lang: AvailableLanguages,
  paymentLink: string | undefined,
  prevState: ComleteUserCreationUserFormState,
  formData: FormData
) {
  const dict = await getDictionary(lang);

  const CreateUser = completeCreationSchema(dict);

  const validatedFields = CreateUser.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    currencyId: formData.get("currencyId"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: {
        text: dict.api.user.create.error,
        type: "error",
      },
    };
  }

  // Prepare data for insertion into the database
  const { name, password, email, currencyId } = validatedFields.data;

  let userCreatedId: string;

  try {
    const user = await getDBUser({
      filters: {
        email,
        fully_signed_up: false,
      },
    });

    if (!user) {
      return {
        message: {
          text: "Error",
          type: "error",
        },
      };
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await updateDBUser({
      filters: {
        id: (user as User).id,
      },
      data: {
        password: hashedPassword,
        name,
        fully_signed_up: true,
        currency_id: Number(currencyId),
      },
    });

    userCreatedId = (user as User).id as string;

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    throw error;
  }

  const paymentUrl = `${paymentLink}?client_reference_id=${userCreatedId}&prefilled_email=${email}&locale=${lang}`;

  redirect(paymentUrl);
}

export async function updatePassword(
  lang: AvailableLanguages,
  prevState: UpdatePasswordFormState,
  formData: FormData
) {
  const dict = await getDictionary(lang);

  const session = await auth();
  const userId = session?.user?.id as string;

  const UpdatePasswordFormSchema = createUpdatePasswordFormSchema(dict);

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
        text: dict.api.password.update.error,
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
          text: dict.api.password.update.userNotFound,
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
          text: dict.api.password.update.invalidPassword,
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
        text: dict.api.password.update.error,
        type: "error",
      },
    };
  }

  return {
    message: {
      text: dict.api.password.update.success,
      type: "success",
    },
  };
}
