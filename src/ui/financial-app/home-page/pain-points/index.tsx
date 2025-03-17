import { AppDictionary, AvailableLanguages } from "@/src/translations";
import { PainPointsEs } from "./pain-points-es";
import { PainPointsEn } from "./pain-points-en";

export type PainPointsProps = {
  lang: AvailableLanguages;
  dict: AppDictionary;
  variant?: "dark" | "light";
};

export const PainPoints = ({ lang, dict }: PainPointsProps) => {
  if (lang === "es") {
    return <PainPointsEs dict={dict} />;
  }
  return <PainPointsEn dict={dict} />;
};
