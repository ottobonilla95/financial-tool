import { capitalizeFirstLetter } from "@/src/helpers/capitalize-first-letter";
import { AppDictionary } from "@/src/translations";
import { Divider, Price } from "@/src/ui/components";
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
  dict: AppDictionary;
};

export const EmotionCategoryItem = ({
  emotionData,
  dict,
}: EmotionCategoryItemProps) => {
  const totalAmount = emotionData.categories.reduce(
    (sum, category) => sum + category.amount,
    0
  );

  return (
    <div className="p-4">
      <h3 className="font-medium text-md mb-2">
        {`${dict.shared.emotion}: ${capitalizeFirstLetter(
          dict.forms.expense.create[
            emotionData.emotionName as keyof typeof dict.forms.expense.create
          ]
        )}`}
      </h3>
      <ul className="space-y-1 text-neutral-500">
        {emotionData.categories.slice(0, 3).map((category) => (
          <li key={category.name} className="flex justify-between">
            <span>{capitalizeFirstLetter(category.name)}</span>
            <Price amount={category.amount} />
          </li>
        ))}
      </ul>
      <div className="h-2" />
      <Divider />
      <div className="flex justify-between pt-2 text-neutral-600">
        <span className="font-medium">{dict.shared.total}</span>
        <Price amount={totalAmount} className="text-neutral-600 font-medium" />
      </div>
    </div>
  );
};
