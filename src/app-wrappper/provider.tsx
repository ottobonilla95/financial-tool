"use client";

import { createContext } from "react";
import { Currency } from "../types";

export type AppContextProps = {
  currency: Currency;
};

export const AppContext = createContext<AppContextProps>({
  currency: { id: 1, name: "USD", symbol: "$" },
});

export type AppProviderProps = {
  currency: Currency;
  children: React.ReactNode;
};

export function AppProvider({ currency, children }: AppProviderProps) {
  return (
    <AppContext.Provider value={{ currency }}>{children}</AppContext.Provider>
  );
}
