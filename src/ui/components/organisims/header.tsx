import Link from "next/link";
import React from "react";
import AppLogo from "../../app-logo";
import { LanguagePicker } from "../../language-picker";

export type HeaderProps = {
  lang: string;
};

export const Header = ({ lang }: HeaderProps) => {
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
            Pricing
          </span>
        </Link>
      </div>
      <div>
        <LanguagePicker currentLocale={lang} />
      </div>
    </div>
  );
};
