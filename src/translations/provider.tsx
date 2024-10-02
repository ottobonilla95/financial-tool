"use client";

import React, { createContext } from "react";
import { AppDictionary, AvailableLanguages } from "./types";

export type IntlContextProps = {
  lang: AvailableLanguages;
  dict: Partial<AppDictionary>;
};

export const IntlContext = createContext<IntlContextProps>({
  lang: "en",
  dict: {},
});

export type IntlProviderProps = {
  children: React.ReactNode;
  lang: AvailableLanguages;
  dict: Partial<AppDictionary>;
};
export const IntlProvider = ({ children, dict, lang }: IntlProviderProps) => {
  return (
    <IntlContext.Provider value={{ lang, dict }}>
      {children}
    </IntlContext.Provider>
  );
};
