"use client";

import { lusitana } from "@/src/styles/fonts";
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button, Dropdown } from "@/src/ui/components";
import { useActionState, useState } from "react";
import { createUser, CreateUserFormState } from "@/src/form-actions/auth";
import { Currency } from "@/src/types";
import { AppDictionary } from "@/src/translations";
import { useTranslations } from "@/src/translations/use-translations";
import { SubscriptionPlan, pricingPlans } from "../financial-app/pricing";

export type SignupFormPropd = {
  currencies: Currency[];
  dict: AppDictionary;
  plan: SubscriptionPlan;
};
export const SignupForm = ({ currencies, dict, plan }: SignupFormPropd) => {
  const initialState: CreateUserFormState = { message: {}, errors: {} };
  const paymentLinkEnvVar = pricingPlans.find(
    (p) => p.planName === plan
  )?.paymentLink;

  const paymentLink = process.env[paymentLinkEnvVar as string] || "";

  const { lang } = useTranslations();
  const createUserAction = createUser.bind(null, lang, plan, paymentLink);

  const [state, formAction, isPending] = useActionState(
    createUserAction,
    initialState
  );

  const [selectedCurrency, setSelectedCurrency] = useState<string>();

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          {dict.authPages.createAccount}
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="name"
            >
              {`${dict.shared.name} *`}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="name"
                type="text"
                name="name"
                placeholder={dict.authPages.enterYourName}
                required
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              {`${dict.shared.email} *`}
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
          {/* Currency */}
          <div className="my-4">
            <label
              htmlFor="category"
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
            >
              {`${dict.shared.currency} *`}
            </label>
            <div className="relative">
              <Dropdown
                options={[
                  ...currencies.map((currency) => ({
                    value: currency.id.toString(),
                    label: currency.name,
                  })),
                ]}
                onChange={(option) => {
                  setSelectedCurrency(option?.value);
                }}
                showAddButon={false}
              />
              <input type="hidden" name="currencyId" value={selectedCurrency} />
            </div>
            <div id="category-error" aria-live="polite" aria-atomic="true">
              {state?.errors?.currencyId &&
                state.errors.currencyId.map((error: string) => (
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
              {`${dict.shared.password} *`}
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
                placeholder={dict.authPages.enterYourPasswordConfirmation}
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
          {dict.authPages.createAccount}
        </Button>

        {!isPending && (
          <Button
            className="mt-4"
            aria-disabled={isPending}
            icon={<ArrowRightIcon className="h-5 w-5" />}
            iconPosition="right"
            href="/login"
          >
            {dict.authPages.login}
          </Button>
        )}

        <div
          className="flex mt-3 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {state.message?.text && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{state.message.text}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
};
