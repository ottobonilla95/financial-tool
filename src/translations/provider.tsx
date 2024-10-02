"use client";

import { createContext } from "react";
import { AppDictionary, AvailableLanguages } from "./types";

export type AppContextProps = {
  lang: AvailableLanguages;
  dict: Partial<AppDictionary>;
};

export const IntlContext = createContext<AppContextProps>({
  lang: "en",
  dict: {},
});

export type AppProviderProps = {
  children: React.ReactNode;
  lang: AvailableLanguages;
  dict: Partial<AppDictionary>;
};

export function IntlProvider({ children, dict, lang }: AppProviderProps) {
  return (
    <IntlContext.Provider value={{ lang, dict }}>
      {children}
    </IntlContext.Provider>
  );
}
