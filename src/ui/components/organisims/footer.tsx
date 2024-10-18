import { AppDictionary } from "@/src/translations";
import Link from "next/link";
import React from "react";
import { Container } from "../atoms";

export type FooterProps = {
  dict: AppDictionary;
};

export const Footer = ({ dict }: FooterProps) => {
  return (
    <footer className="bg-neutral-800 text-white py-8 border-t border-neutral-700 text-neutral-100 tracking-tight">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              {dict.footer.aboutUsTitle}
            </h3>
            <p className="text-lg opacity-80">{dict.footer.aboutUsDescription}</p>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              {dict.footer.quickLinksTitle}
            </h3>
            <ul className="opacity-80">
              <li className="mb-2">
                <Link href="/" className="hover:text-white">
                  {dict.footer.home}
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/about-us"
                  className="hover:text-white"
                >
                  {dict.footer.aboutUs}
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/contact-us"
                  className="hover:text-white"
                >
                  {dict.footer.contactUs}
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/privacy-policy"
                  className="hover:text-white"
                >
                  {dict.footer.privacyPolicy}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-700 my-8"></div>

        {/* Copyright Section */}
        <div className="text-center">
          <p className="">
            &copy; {new Date().getFullYear()}
            {`TrackMySpend. ${dict.footer.allRightsReserved}`}
          </p>
        </div>
      </Container>
    </footer>
  );
};
