"use client";

import { lusitana } from "@/src/styles/fonts";
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "@/src/ui/components";
import { useContext } from "react";
import { authenticate } from "@/src/form-actions/auth";
import { useTranslations } from "@/src/translations/use-translations";
import { IntlContext } from "@/src/translations/provider";
import { useFormState, useFormStatus } from "react-dom";
import { SubmitButton } from "../forms";

export const LoginForm = () => {
  const { dict } = useContext(IntlContext);
  const { lang } = useTranslations();
  const authenticateAction = authenticate.bind(null, lang);

  const { pending: isPending } = useFormStatus();
  const [errorMessage, formAction] = useFormState(
    authenticateAction,
    undefined
  );

  return (
    <form action={formAction}>
      <div className="flex-1 text-neutral-100 min-w-[350px]">
        <h1 className={`${lusitana.className} mb-3 text-5xl font-extrabold`}>
          {dict.authPages?.login}
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium "
              htmlFor="email"
            >
              {dict.shared?.email}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border py-[9px] pl-10 text-sm outline-2 placeholder:text-neutral-500 text-neutral-500"
                id="email"
                type="email"
                name="email"
                placeholder={dict.authPages?.enterYourEmail}
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-500 peer-focus:text-neutral-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium"
              htmlFor="password"
            >
              {dict.shared?.password}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border py-[9px] pl-10 text-sm outline-2 placeholder:text-neutral-500 text-neutral-500"
                id="password"
                type="password"
                name="password"
                placeholder={dict.authPages?.enterYourPassword}
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        <SubmitButton
          className="mt-4 rounded-lg bg-lime-500 font-medium text-black hover:opacity-70 focus-visible:outline-black active:opacity-80 border-0"
          aria-disabled={isPending}
          icon={<ArrowRightIcon className="h-5 w-5" />}
          iconPosition="right"
          loading={isPending}
        >
          {dict.authPages?.login}
        </SubmitButton>

        {!isPending && (
          <Button
            className="mt-4 border-0"
            aria-disabled={isPending}
            icon={<ArrowRightIcon className="h-5 w-5" />}
            iconPosition="right"
            href="/pricing"
          >
            {dict.authPages?.createAccount}
          </Button>
        )}

        <div
          className="flex items-end space-x-1 mt-3"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
};
