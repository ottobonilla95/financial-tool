import React from "react";
import { AvailableLanguages } from "@/src/translations";
import { PricingOfferSectionEs } from "./pricing-offer-es";
import { PricingOfferSectionEn } from "./pricing-offer-en";

export type PricingOfferSectionProps = {
  lang: AvailableLanguages;
  campaign?: string;
};
export const PricingOfferSection = ({
  lang,
  campaign,
}: PricingOfferSectionProps) => {
  let hotmartCheckoutUrl = process.env.HOTMART_CHECKOUT_URL;

  if (campaign) {
    hotmartCheckoutUrl = `${hotmartCheckoutUrl}&sck=${campaign}`;
  }

  if (lang === "es") {
    return <PricingOfferSectionEs campaign={campaign} />;
  }

  return <PricingOfferSectionEn campaign={campaign} />;
};
