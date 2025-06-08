import React from "react";
import { AvailableLanguages } from "@/src/translations";
import { PricingOfferSectionEs } from "./pricing-offer-es";
import { PricingOfferSectionEn } from "./pricing-offer-en";

export type PricingOfferSectionProps = {
  lang: AvailableLanguages;
  campaign?: string;
  fbclid?: string;
};
export const PricingOfferSection = ({
  lang,
  campaign,
  fbclid,
}: PricingOfferSectionProps) => {
  if (lang === "es") {
    return <PricingOfferSectionEs campaign={campaign} fbclid={fbclid} />;
  }

  return <PricingOfferSectionEn campaign={campaign} fbclid={fbclid} />;
};
