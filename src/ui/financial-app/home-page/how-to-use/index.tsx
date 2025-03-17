import { AvailableLanguages } from "@/src/translations";
import React from "react";
import { HowToUseEs } from "./how-to-use-es";
import { HowToUseEn } from "./how-to-use-en";

export type HowToUseProps = { lang: AvailableLanguages };

export const HowToUse = ({ lang }: HowToUseProps) => {
  if (lang === "es") {
    return <HowToUseEs />;
  }

  return <HowToUseEn />;
};
