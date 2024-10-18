"use client";

import Link from "next/link";
import React, { useState } from "react";
import AppLogo from "../../app-logo";
import { LanguagePicker } from "../../language-picker";
import { AppDictionary } from "@/src/translations";
import { Container } from "../atoms";

export type HeaderProps = {
  lang: string;
  dict: AppDictionary;
};

export const Header = ({ lang, dict }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="bg-neutral-800">
      <Container>
        <div className="flex h-[100px] items-center justify-between md:h-[120px]">
          {/* Logo */}
          <div>
            <Link href="/">
              <AppLogo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-end pr-10 gap-3">
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

          {/* Language Picker */}
          <div className="hidden md:block">
            <LanguagePicker currentLocale={lang} />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white focus:outline-none"
            >
              {/* Menu Icon */}
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 space-y-2">
            <Link href="/pricing">
              <span className="block text-white font-medium hover:underline">
                {dict.shared.pricing}
              </span>
            </Link>
            <Link href="/login">
              <span className="block text-white font-medium hover:underline">
                {dict.authPages.login}
              </span>
            </Link>
            <LanguagePicker currentLocale={lang} />
          </div>
        )}
      </Container>
    </div>
  );
};
