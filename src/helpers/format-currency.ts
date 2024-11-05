import { Currency } from "../types";

export const formatCurrency = (amount: number, currency: Currency) => {
  const localeMap: Record<string, string> = {
    co: "es-CO",
    mx: "es-MX",
    ar: "es-AR",
    cl: "es-CL",
    uy: "es-UY",
    do: "es-DO",
    ve: "es-VE",
    py: "es-PY",
    pe: "es-PE",
    gt: "es-GT",
    pa: "es-PA",
    ni: "es-NI",
    hn: "es-HN",
    ch: "de-CH",
    ca: "en-CA",
    jp: "ja-JP",
    br: "pt-BR",
    au: "en-AU",
    cn: "zh-CN",
    nz: "en-NZ",
    ru: "ru-RU",
    in: "hi-IN",
    se: "sv-SE",
    // Default mappings for some common ones
    us: "en-US",
    gb: "en-GB",
    eu: "en-EU",
    de: "de-DE", // Euro (defaulting to Germany)
  };

  // Fallback to "en" if no specific locale found
  const locale = localeMap[currency.countryCode?.toLowerCase() || "us"] || "en";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency.currencyCode?.toUpperCase(),
  }).format(amount);
};
