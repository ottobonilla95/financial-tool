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
import { useContext, useState } from "react";
import { createUser, CreateUserFormState } from "@/src/form-actions/auth";
import { Currency } from "@/src/types";
import { useTranslations } from "@/src/translations/use-translations";
import { SubscriptionPlan, pricingPlans } from "../financial-app/pricing";
import { IntlContext } from "@/src/translations/provider";
import { useFormState, useFormStatus } from "react-dom";
import { SubmitButton } from "../forms";

export type SignupFormPropd = {
  currencies: Currency[];
  plan: SubscriptionPlan;
};
export const SignupForm = ({ currencies, plan }: SignupFormPropd) => {
  const { dict } = useContext(IntlContext);

  const initialState: CreateUserFormState = { message: {}, errors: {} };
  const paymentLink = pricingPlans.find(
    (p) => p.planName === plan
  )?.paymentLink;

  const { lang } = useTranslations();
  const createUserAction = createUser.bind(null, lang, plan, paymentLink);

  const { pending: isPending } = useFormStatus();
  const [state, formAction] = useFormState(createUserAction, initialState);

  const [selectedCurrency, setSelectedCurrency] = useState<string>();

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <form action={formAction}>
      <div className="flex-1 text-neutral-100 max-w-[350px]">
        <h1 className={`${lusitana.className} mb-3 text-5xl font-extrabold`}>
          {dict.authPages?.createAccount}
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium "
              htmlFor="name"
            >
              {`${dict.shared?.name} *`}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-neutral-200 py-[9px] pl-10 text-base outline-2 placeholder:text-neutral-500 text-neutral-500 "
                id="name"
                type="text"
                name="name"
                placeholder={dict.authPages?.enterYourName}
                required
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-500 peer-focus:text-neutral-900" />
            </div>
          </div>
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium"
              htmlFor="email"
            >
              {`${dict.shared?.email} *`}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-neutral-200 py-[9px] pl-10 text-base outline-2 placeholder:text-neutral-500 text-neutral-500"
                id="email"
                type="email"
                name="email"
                placeholder={dict.authPages?.enterYourEmail}
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-500 peer-focus:text-neutral-900" />
            </div>
          </div>
          {/* Currency */}
          <div className="my-4">
            <label
              htmlFor="category"
              className="mb-3 mt-5 block text-xs font-medium"
            >
              {`${dict.shared?.currency} *`}
            </label>
            <div className="relative">
              <Dropdown
                options={[
                  ...currencies.map((currency) => ({
                    value: currency.id.toString(),
                    label:
                      dict.shared?.currencies[
                        currency.currencyCode as keyof typeof dict.shared.currencies
                      ] || "",
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
              className="mb-3 mt-5 block text-xs font-medium"
              htmlFor="password"
            >
              {`${dict.shared?.password} *`}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-neutral-200 py-[9px] pl-10 text-base outline-2 placeholder:text-neutral-500 text-neutral-500"
                id="password"
                type="password"
                name="password"
                placeholder={dict.authPages?.enterYourPassword}
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-500 peer-focus:text-neutral-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium"
              htmlFor="password"
            >
              {`${dict.shared?.confirmPassword} *`}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-neutral-200 py-[9px] pl-10 text-base outline-2 placeholder:text-neutral-500 text-neutral-500"
                id="passwordConfirmation"
                type="password"
                name="passwordConfirmation"
                placeholder={dict.authPages?.enterYourPasswordConfirmation}
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-500 peer-focus:text-neutral-900" />
            </div>
          </div>
        </div>

        <div className="my-4">
          <input
            type="checkbox"
            id="terms"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="h-4 w-4 text-lime-500 border-neutral-300 rounded focus:ring-indigo-500"
          />
          <label htmlFor="terms" className="ml-2 text-sm">
            {dict.authPages?.acceptPrivacyPolicy}{" "}
            <a href="/privacy-policy text-lime-500" className="underline">
              {dict.authPages?.privacyPolicy}
            </a>
          </label>
        </div>

        {/* Submit Button */}

        <SubmitButton
          className="mt-4 rounded-lg bg-lime-500 font-medium text-black hover:opacity-70 focus-visible:outline-black active:opacity-80 border-0"
          icon={<ArrowRightIcon className="h-5 w-5" />}
          iconPosition="right"
          loading={isPending}
          disabled={!isChecked}
          aria-disabled={isPending || !isChecked}
        >
          {dict.authPages?.createAccount}
        </SubmitButton>

        {!isPending && (
          <Button
            className="mt-4 border-0"
            aria-disabled={isPending}
            icon={<ArrowRightIcon className="h-5 w-5" />}
            iconPosition="right"
            href="/login"
          >
            {dict.authPages?.login}
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
