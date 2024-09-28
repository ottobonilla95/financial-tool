import "server-only";
import { AppDictionary, AvailableLanguages } from "./types";

const dictionaries: {
  en: () => Promise<AppDictionary>;
  es: () => Promise<AppDictionary>;
} = {
  en: () => import("./en.json").then((module) => module.default),
  es: () => import("./es.json").then((module) => module.default),
};

export const getDictionary = async (
  locale: AvailableLanguages
): Promise<AppDictionary> => dictionaries[locale]();
