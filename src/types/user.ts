import { Currency } from "./currency";

export type User = {
  id?: string;
  name: string;
  email?: string;
  lastUpdated: string;
  password?: string;
  currency?: Currency;
  tourFinished?: boolean;
  subscriptionPlan?: string;
  subscriptionCancelAt?: number;
  stripeId?: string;
  subscriptionId?: string;
  fullySignedUp: boolean;
  pricingGroup: string;
  lang: string;
};
