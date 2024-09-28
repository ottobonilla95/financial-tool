"use client";

import React from "react";
import { ArrowRightIcon, KeyIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast, TypeOptions } from "react-toastify";
import { AppDictionary } from "@/src/translations";
import {
  updatePassword,
  UpdatePasswordFormState,
} from "@/src/form-actions/auth";
import { Button } from "../components";

export type ChangePasswordFormProps = {
  dict: AppDictionary;
};

export const ChangePasswordForm = ({ dict }: ChangePasswordFormProps) => {
  const initialState: UpdatePasswordFormState = { message: {}, errors: {} };

  const [state, formAction, loading] = useActionState(
    updatePassword,
    initialState
  );

  const router = useRouter();

  useEffect(() => {
    if (state?.message?.text) {
      toast(state.message.text, { type: state.message.type as TypeOptions });

      if (state.message.type === "success") {
        router.push("/dashboard/account");
      }
    }
  }, [state]);

  return (
    <div className="mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        {dict.accountPage.changePassword}
      </h1>

      <form action={formAction}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6 ">
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="currentPassword"
            >
              {`${dict.accountPage.currentPassword} *`}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="currentPassword"
                type="password"
                name="currentPassword"
                placeholder={dict.accountPage.enterCurrentPassword}
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="name-error" aria-live="polite" aria-atomic="true">
              {state?.errors?.currentPassword &&
                state.errors.currentPassword.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              {`${dict.accountPage.newPassword} *`}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder={dict.accountPage.enterNewPassword}
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="name-error" aria-live="polite" aria-atomic="true">
              {state?.errors?.password &&
                state.errors.password.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              {`${dict.shared.confirmPassword} *`}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="passwordConfirmation"
                type="password"
                name="passwordConfirmation"
                placeholder={dict.accountPage.enterYourPasswordConfirmation}
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="name-error" aria-live="polite" aria-atomic="true">
              {state?.errors?.passwordConfirmation &&
                state.errors.passwordConfirmation.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Button
            className="mt-4 rounded-lg bg-black font-medium text-white hover:opacity-70 focus-visible:outline-black active:opacity-80"
            aria-disabled={loading}
            loading={loading}
            type="submit"
          >
            {dict.accountPage.changePassword}
          </Button>
        </div>
      </form>
    </div>
  );
};
