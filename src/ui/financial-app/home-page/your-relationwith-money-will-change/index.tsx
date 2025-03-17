import React from "react";
import { AvailableLanguages } from "@/src/translations";
import { YourRelationWithMoneyWillChangeEs } from "./your-relationwith-money-will-change-es";
import { YourRelationWithMoneyWillChangeEn } from "./your-relationwith-money-will-change-en";

export type YourRelationWithMoneyWillChangeProps = {
  lang: AvailableLanguages;
};

export const YourRelationWithMoneyWillChange = ({
  lang,
}: YourRelationWithMoneyWillChangeProps) => {
  if (lang === "es") {
    return <YourRelationWithMoneyWillChangeEs />;
  }

  return <YourRelationWithMoneyWillChangeEn />;
};
