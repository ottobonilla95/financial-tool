"use client";

import { AppContext } from "@/src/app-wrappper/provider";
import { useContext } from "react";

export type PriceProps = {
  amount: number;
  className?: string;
};

export const Price = ({ amount, className }: PriceProps) => {
  const { currency } = useContext(AppContext);

  return (
    <div className={className}>
      {currency?.symbol} {amount.toFixed(2)}
    </div>
  );
};
