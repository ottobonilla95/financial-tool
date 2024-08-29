import { Currency } from "./currency";

export type User = {
  id?: string;
  name: string;
  email?: string;
  lastUpdated: string;
  password?: string;
  currency?: Currency;
};
