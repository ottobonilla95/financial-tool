import { useContext } from "react";
import { IntlContext } from "./provider";

export const useTranslations = () => {
  const { dict, lang } = useContext(IntlContext);

  return { dict, lang };
};
