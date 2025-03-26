"use client";

import { useContext } from "react";
import { DashboardContext } from "./provider";
import { CategoryFilter } from "./category-filter";
import { ExpenseCategory } from "@/src/types";
import { AppDictionary } from "@/src/translations";

type CategoryFilterContainerProps = {
  categories: ExpenseCategory[];
  dict: AppDictionary;
};

export const CategoryFilterContainer = ({
  categories,
  dict,
}: CategoryFilterContainerProps) => {
  const { selectedCategories, setSelectedCategories } =
    useContext(DashboardContext);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(
      selectedCategories.includes(categoryId)
        ? selectedCategories.filter((id) => id !== categoryId)
        : [...selectedCategories, categoryId]
    );
  };

  const handleSelectAll = () => {
    setSelectedCategories(categories.map((cat) => cat.id));
  };

  const handleDeselectAll = () => {
    setSelectedCategories([]);
  };

  return (
    <CategoryFilter
      categories={categories}
      selectedCategories={selectedCategories}
      onCategoryToggle={handleCategoryToggle}
      onSelectAll={handleSelectAll}
      onDeselectAll={handleDeselectAll}
      dict={dict}
    />
  );
};
