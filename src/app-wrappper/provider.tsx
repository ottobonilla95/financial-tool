"use client";

import { createContext } from "react";
import { Currency, SubscriptionDetails } from "../types";

export type AppContextProps = {
  currency: Currency;
  subscriptionDetails?: SubscriptionDetails;
};

export const AppContext = createContext<AppContextProps>({
  currency: { id: 1, name: "USD", symbol: "$" },
  subscriptionDetails: {
    isPremium: false,
    isUserOnStripe: false,
    stripeCustomerPortalLink: "",
  },
});

export type AppProviderProps = {
  currency: Currency;
  children: React.ReactNode;
  subscriptionDetails?: SubscriptionDetails;
};

export function AppProvider({
  currency,
  children,
  subscriptionDetails,
}: AppProviderProps) {
  return (
    <AppContext.Provider value={{ currency, subscriptionDetails }}>
      {children}
    </AppContext.Provider>
  );
}
