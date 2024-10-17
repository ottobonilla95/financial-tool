import Link from "next/link";
import React from "react";
import AppLogo from "../../app-logo";
import { LanguagePicker } from "../../language-picker";
import { AppDictionary } from "@/src/translations";

export type HeaderProps = {
  lang: string;
  dict: AppDictionary;
};

export const Header = ({ lang, dict }: HeaderProps) => {
  return (
    <div className="flex h-[100px] shrink-0 items-center bg-black p-4 md:h-[120px] sm:pl-10">
      <div className="">
        <Link href="/">
          <AppLogo />
        </Link>
      </div>
      <div className="flex-1 flex justify-end pr-10">
        <Link href="/pricing">
          <span className="text-white font-medium hover:underline">
            {dict.shared.pricing}
          </span>
        </Link>
      </div>
      <div>
        <LanguagePicker currentLocale={lang} />
      </div>
    </div>
  );
};
