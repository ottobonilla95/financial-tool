"use client";

import { AppDictionary } from "@/src/translations";
import { ExpenseCategory } from "@/src/types";

type CategoryFilterProps = {
  categories: ExpenseCategory[];
  selectedCategories: string[];
  onCategoryToggle: (categoryId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  dict: AppDictionary;
};

export const CategoryFilter = ({
  categories,
  selectedCategories,
  onCategoryToggle,
  onSelectAll,
  onDeselectAll,
  dict,
}: CategoryFilterProps) => {
  return (
    <div className="mb-6">
      <div className="font-bold mb-3 text-gray-600 uppercase">
        {dict.dashboard.filterByCategory}
      </div>
      <div className="bg-white p-4 rounded-sm shadow-sm">
        <div className="flex gap-4 mb-6">
          <button
            onClick={onSelectAll}
            className="px-4 py-2 text-sm border border-gray-200 rounded-md 
            hover:border-gray-400 transition-colors duration-200 
            bg-white text-gray-700 font-medium flex-1
            hover:bg-gray-50 active:bg-gray-100"
          >
            {dict.shared.selectAll}
          </button>
          <button
            onClick={onDeselectAll}
            className="px-4 py-2 text-sm border border-gray-200 rounded-md 
            hover:border-gray-400 transition-colors duration-200 
            bg-white text-gray-700 font-medium flex-1
            hover:bg-gray-50 active:bg-gray-100"
          >
            {dict.shared.deselectAll}
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => onCategoryToggle(category.id)}
                  className="w-4 h-4 border rounded 
                  focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
                  style={{
                    backgroundColor: selectedCategories.includes(category.id)
                      ? category.color
                      : "white",
                    borderColor: category.color,
                  }}
                />
                {selectedCategories.includes(category.id) && (
                  <svg
                    className="absolute w-3 h-3 text-white pointer-events-none"
                    style={{ left: "2px", top: "2px" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-900">{category.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
