import { AppDictionary, AvailableLanguages } from "@/src/translations";
import { IntroEs } from "./intro-es";
import { IntroEN } from "./intro-en";

export type IntroProps = {
  lang: AvailableLanguages;
  dict: AppDictionary;
  variant?: "dark" | "light";
};

export const Intro = ({ lang, dict, variant }: IntroProps) => {
  if (lang === "es") {
    return <IntroEs dict={dict} variant={variant} />;
  }
  return <IntroEN dict={dict} variant={variant} />;
};
