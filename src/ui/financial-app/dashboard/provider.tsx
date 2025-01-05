"use client";

import { Emotion } from "@/src/types";
import { createContext } from "react";

export type DashboardContextProps = {
  emotions: Emotion[];
  month: number;
  year?: number;
};

export const DashboardContext = createContext<DashboardContextProps>({
  emotions: [],
  month: 0,
  year: 0,
});

export type DashboardProviderProps = {
  children: React.ReactNode;
  emotions: Emotion[];
  month: number;
  year?: number;
};

export function DashboardProvider({
  children,
  emotions,
  month,
  year,
}: DashboardProviderProps) {
  return (
    <DashboardContext.Provider value={{ emotions, month, year }}>
      {children}
    </DashboardContext.Provider>
  );
}
