import Link from "next/link";
import React from "react";
import AppLogo from "../../app-logo";
import { LanguagePicker } from "../../language-picker";
import { AppDictionary } from "@/src/translations";
import { Container } from "../atoms";

export type HeaderProps = {
  lang: string;
  dict: AppDictionary;
};

export const Header = ({ lang, dict }: HeaderProps) => {
  return (
    <div className="bg-neutral-800">
      <Container>
        <div className="flex h-[100px] items-center md:h-[120px]">
          <div className="">
            <Link href="/">
              <AppLogo />
            </Link>
          </div>
          <div className="flex-1 flex justify-end pr-10 gap-3">
            <Link href="/pricing">
              <span className="text-white font-medium hover:underline">
                {dict.shared.pricing}
              </span>
            </Link>
            <Link href="/login">
              <span className="text-white font-medium hover:underline">
                {dict.authPages.login}
              </span>
            </Link>
          </div>
          <div>
            <LanguagePicker currentLocale={lang} />
          </div>
        </div>
      </Container>
    </div>
  );
};
