"use client";

import { lusitana } from "@/src/styles/fonts";
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "@/src/ui/components";
import { useActionState } from "react";
import { authenticate } from "@/src/form-actions/auth";
import { AppDictionary } from "@/src/translations";
import { useTranslations } from "@/src/translations/use-translations";

export type LoginFormProps = {
  dict: AppDictionary;
};
export const LoginForm = ({ dict }: LoginFormProps) => {
  const { lang } = useTranslations();
  const authenticateAction = authenticate.bind(null, lang);

  const [errorMessage, formAction, isPending] = useActionState(
    authenticateAction,
    undefined
  );

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          {dict.authPages.pleaseLogIn}
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              {dict.shared.email}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder={dict.authPages.enterYourEmail}
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              {dict.shared.password}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder={dict.authPages.enterYourPassword}
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <Button
          className="mt-4 rounded-lg bg-black font-medium text-white hover:opacity-70 focus-visible:outline-black active:opacity-80"
          aria-disabled={isPending}
          icon={<ArrowRightIcon className="h-5 w-5 text-gray-50" />}
          iconPosition="right"
          loading={isPending}
        >
          {dict.authPages.login}
        </Button>
        {!isPending && (
          <Button
            className="mt-4"
            aria-disabled={isPending}
            icon={<ArrowRightIcon className="h-5 w-5" />}
            iconPosition="right"
            href="/pricing"
          >
            {dict.authPages.createAccount}
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
