"use client";

import { AppContext } from "@/src/app-wrappper/provider";
import { formatCurrency } from "@/src/helpers/format-currency";
import { useContext } from "react";

export type PriceProps = {
  amount: number;
  className?: string;
};

export const Price = ({ amount, className }: PriceProps) => {
  const { currency } = useContext(AppContext);

  const formattedAmount = formatCurrency(amount, currency);

  return <div className={className}>{formattedAmount}</div>;
};
