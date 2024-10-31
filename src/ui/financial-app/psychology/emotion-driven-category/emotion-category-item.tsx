import React from "react";

type EmotionCategory = {
  name: string;
  amount: number;
};

type EmotionData = {
  emotionName: string;
  categories: EmotionCategory[];
};

type EmotionCategoryItemProps = {
  emotionData: EmotionData;
};

export const EmotionCategoryItem = ({
  emotionData,
}: EmotionCategoryItemProps) => {
  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-medium text-md mb-2 text-gray-700">
        Emotion: {emotionData.emotionName}
      </h3>
      <ul className="space-y-1">
        {emotionData.categories.slice(0, 3).map((category) => (
          <li key={category.name} className="flex justify-between">
            <span>{category.name}</span>
            <span className="font-semibold">${category.amount.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
