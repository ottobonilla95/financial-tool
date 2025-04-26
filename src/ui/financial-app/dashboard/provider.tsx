"use client";

import { Emotion, ExpenseCategory } from "@/src/types";
import { createContext, useEffect, useState } from "react";

type DashboardContextType = {
  emotions: Emotion[];
  month: number;
  year?: number;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
};

export const DashboardContext = createContext<DashboardContextType>({
  emotions: [],
  month: new Date().getMonth() + 1,
  selectedCategories: [],
  setSelectedCategories: () => {},
});

export type DashboardProviderProps = {
  children: React.ReactNode;
  emotions: Emotion[];
  month: number;
  year?: number;
  categories: ExpenseCategory[];
};

export const DashboardProvider = ({
  children,
  emotions,
  month,
  year,
  categories,
}: DashboardProviderProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categories.map((cat) => cat.id)
  );

  useEffect(() => {
    setSelectedCategories(categories.map((cat) => cat.id));
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        emotions,
        month,
        year,
        selectedCategories,
        setSelectedCategories,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
