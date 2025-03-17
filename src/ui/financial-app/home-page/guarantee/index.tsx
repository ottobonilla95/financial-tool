import React from "react";
import { AvailableLanguages } from "@/src/translations";
import { GuaranteeSectionEs } from "./guarantee-es";
import { GuaranteeSectionEn } from "./guarantee-en";

export type GuaranteeSectionProps = {
  lang: AvailableLanguages;
};
export const GuaranteeSection = ({ lang }: GuaranteeSectionProps) => {
  if (lang === "es") {
    return <GuaranteeSectionEs />;
  }

  return <GuaranteeSectionEn />;
};
