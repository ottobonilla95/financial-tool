"use client";

import { AppContext } from "@/src/app-wrappper/provider";
import { useContext } from "react";

export type PriceProps = {
  amount: number;
};

export const Price = ({ amount }: PriceProps) => {
  const { currency } = useContext(AppContext);

  return (
    <div>
      {currency?.symbol} {amount.toFixed(2)}
    </div>
  );
};
