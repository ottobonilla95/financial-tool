import { Currency } from "../types";

export const formatCurrency = (amount: number, currency: Currency) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: currency.currencyCode?.toLocaleUpperCase(),
  }).format(amount);
};
