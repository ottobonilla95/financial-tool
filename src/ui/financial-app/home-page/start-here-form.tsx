"use client";

import { createUser, CreateUserFormState } from "@/src/form-actions/auth";
import { AppDictionary, AvailableLanguages } from "@/src/translations";
import React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { SubmitButton } from "../../forms";
import { AtSymbolIcon } from "@heroicons/react/24/outline";
import { FireIcon } from "@heroicons/react/24/solid";

export type AppScreenshotsProps = {
  dict: AppDictionary;
  lang: AvailableLanguages;
};

export const StartForm = ({ dict, lang }: AppScreenshotsProps) => {
  const initialState: CreateUserFormState = { message: {}, errors: {} };

  const createUserAction = createUser.bind(null, lang);

  const { pending: isPending } = useFormStatus();
  const [state, formAction] = useFormState(createUserAction, initialState);

  return (
    <div className="flex mt-4 sm:mt-8 mb-4 justify-center sm:justify-start w-full sm:w-auto tracking-tight">
      <form action={formAction}>
        <div>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-neutral-200 py-[9px] pl-10 text-base outline-2 placeholder:text-neutral-500 text-neutral-500"
              id="email"
              type="email"
              name="email"
              placeholder={dict.shared.email}
              required
            />
            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-500 peer-focus:text-neutral-900" />
          </div>
        </div>

        <SubmitButton
          className="mt-4 !text-base group rounded-lg bg-lime-500 font-medium text-black hover:opacity-70 focus-visible:outline-black active:opacity-80 border-0 min-w-[300px]"
          icon={
            <FireIcon className="w-6 h-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-200 ease-in-out" />
          }
          iconPosition="left"
          loading={isPending}
        >
          {dict.mainPage.takeControlToday}
        </SubmitButton>
      </form>
    </div>
  );
};
