"use client";

import { createContext } from "react";
import { Currency, SubscriptionDetails } from "../types";

export type AppContextProps = {
  currency: Currency;
  allCurrencies: Currency[];
  subscriptionDetails?: SubscriptionDetails;
};

export const AppContext = createContext<AppContextProps>({
  currency: { id: 1, name: "USD", symbol: "$" },
  allCurrencies: [],
  subscriptionDetails: {
    isPremium: false,
    isUserOnStripe: false,
    stripeCustomerPortalLink: "",
  },
});

export type AppProviderProps = {
  currency: Currency;
  allCurrencies: Currency[];
  children: React.ReactNode;
  subscriptionDetails?: SubscriptionDetails;
};

export function AppProvider({
  currency,
  allCurrencies,
  children,
  subscriptionDetails,
}: AppProviderProps) {
  return (
    <AppContext.Provider
      value={{ currency, subscriptionDetails, allCurrencies }}
    >
      {children}
    </AppContext.Provider>
  );
}
