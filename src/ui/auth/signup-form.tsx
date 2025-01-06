"use client";

import { lusitana } from "@/src/styles/fonts";
import {
  KeyIcon,
  ExclamationCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/20/solid";
import { Button, Dropdown } from "@/src/ui/components";
import { useContext, useState } from "react";
import {
  ComleteUserCreationUserFormState,
  completeUserCreation,
} from "@/src/form-actions/auth";
import { Currency, OfferType } from "@/src/types";
import { useTranslations } from "@/src/translations/use-translations";
import { SubscriptionPlan, pricingPlans } from "../financial-app/pricing";
import { IntlContext } from "@/src/translations/provider";
import { useFormState, useFormStatus } from "react-dom";
import { SubmitButton } from "../forms";
import clsx from "clsx";

export type SignupFormPropd = {
  currencies: Currency[];
  plan: SubscriptionPlan;
  email: string;
  offer?: OfferType;
};

export const SignupForm = ({
  currencies,
  plan,
  email,
  offer,
}: SignupFormPropd) => {
  const { dict } = useContext(IntlContext);
  const initialState: ComleteUserCreationUserFormState = {
    message: {},
    errors: {},
  };
  const pricingPlansToUse =
    pricingPlans[offer || "default"] || pricingPlans["default"];

  const paymentLink = pricingPlansToUse.find(
    (p) => p.planName === plan
  )?.paymentLink;

  const { lang } = useTranslations();
  const createUserAction = completeUserCreation.bind(null, lang, paymentLink);
  const { pending: isPending } = useFormStatus();
  const [state, formAction] = useFormState(createUserAction, initialState);
  const [selectedCurrency, setSelectedCurrency] = useState<string>();
  const [isChecked, setIsChecked] = useState(false);
  const [step, setStep] = useState(1);
  const [formValues, setFormValues] = useState({
    name: "",
    currencyId: "",
    password: "",
    confirmPassword: "",
  });

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleChange = (field: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && step < 4) {
      e.preventDefault();
      nextStep();
    }
  };

  return (
    <form action={formAction} onKeyDown={handleKeyDown}>
      <input type="hidden" name="email" value={email} />

      <div className="flex-1 text-neutral-100 max-w-[350px]">
        <h1 className={`${lusitana.className} mb-3 text-5xl font-extrabold`}>
          {dict.authPages?.createAccount}
        </h1>

        <div
          className={clsx("hidden", {
            "!block": step === 1,
          })}
        >
          <label className="mb-3 mt-5 block text-xs font-medium" htmlFor="name">
            {`${dict.shared?.name} *`}
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-neutral-200 py-[9px] pl-10 text-base outline-2 placeholder:text-neutral-500 text-neutral-500"
              id="name"
              type="text"
              name="name"
              placeholder={dict.authPages?.enterYourName}
              required
              value={formValues.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-500 peer-focus:text-neutral-900" />
          </div>
        </div>

        <div
          className={clsx("my-4 hidden", {
            "!block": step === 2,
          })}
        >
          <label
            htmlFor="currency"
            className="mb-3 mt-5 block text-xs font-medium"
          >
            {`${dict.shared?.currency} *`}
          </label>
          <div className="relative">
            <Dropdown
              options={currencies.map((currency) => ({
                value: currency.id.toString(),
                label:
                  dict.shared?.currencies[
                    currency.currencyCode as keyof typeof dict.shared.currencies
                  ] || "",
              }))}
              onChange={(option) => {
                setSelectedCurrency(option?.value);
                handleChange("currencyId", option?.value || "");
              }}
              showAddButon={false}
              defaultValue={
                formValues.currencyId
                  ? currencies
                      .map((currency) => ({
                        value: currency.id.toString(),
                        label:
                          dict.shared?.currencies[
                            currency.currencyCode as keyof typeof dict.shared.currencies
                          ] || "",
                      }))
                      .find((option) => option.value === formValues.currencyId)
                  : undefined
              }
            />
          </div>
          <input type="hidden" name="currencyId" value={selectedCurrency} />
        </div>

        <div
          className={clsx("hidden", {
            "!block": step === 3,
          })}
        >
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
              value={formValues.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-500 peer-focus:text-neutral-900" />
          </div>
        </div>

        <div
          className={clsx("hidden", {
            "!block": step === 4,
          })}
        >
          <input
            type="checkbox"
            id="terms"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="h-4 w-4 text-lime-500 border-neutral-300 rounded focus:ring-indigo-500"
          />
          <label htmlFor="terms" className="ml-2 text-sm">
            {dict.authPages?.acceptPrivacyPolicy}{" "}
            <a href="/privacy-policy" className="underline text-lime-500">
              {dict.authPages?.privacyPolicy}
            </a>
          </label>
        </div>

        <div className="mt-6 flex sm:flex-row flex-col-reverse gap-4 justify-between">
          {step > 1 && (
            <Button
              className="rounded-lg bg-neutral-200 text-black hover:opacity-70 focus-visible:outline-black active:opacity-80 border-0"
              type="button"
              onClick={prevStep}
            >
              <ArrowLeftIcon className="h-5 w-5 hidden sm:inline" />{" "}
              {dict.shared?.back}
            </Button>
          )}

          {step < 4 && (
            <Button
              className="rounded-lg bg-lime-500 font-medium text-black hover:opacity-70 focus-visible:outline-black active:opacity-80 border-0"
              onClick={nextStep}
              type="button"
            >
              {dict.shared?.next}{" "}
              <ArrowRightIcon className="h-5 w-5 hidden sm:inline" />
            </Button>
          )}

          {step === 4 && (
            <SubmitButton
              className="rounded-lg bg-lime-500 font-medium text-black hover:opacity-70 focus-visible:outline-black active:opacity-80 border-0"
              icon={<ArrowRightIcon className="h-5 w-5 hidden sm:inline" />}
              iconPosition="right"
              loading={isPending}
              disabled={!isChecked}
              aria-disabled={isPending || !isChecked}
            >
              {dict.authPages?.createAccount}
            </SubmitButton>
          )}
        </div>

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
