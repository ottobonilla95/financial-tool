import { AppDictionary } from "@/src/translations";
import React from "react";
import { ArrowDownIcon } from "@heroicons/react/20/solid";

export type PainPointsProps = {
  dict: AppDictionary;
};

export const PainPoints = ({ dict }: PainPointsProps) => {
  return (
    <section
      id="key-features"
      className="text-neutral-100 px-4 md:px-0 tracking-tight my-16 sm:my-32 text-center bg-neutral-900 py-16"
    >
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">
        {dict.mainPage.painPoints.title}
      </h2>
      <ul className="space-y-4 list-disc">
        {dict.mainPage.painPoints.items.map((point, index) => (
          <li key={index} className="flex items-start">
            <p className="flex-1">
              {point.before}{" "}
              <span className="text-red-300">{point.highlight}</span>{" "}
              {point.after}
            </p>
          </li>
        ))}
      </ul>
      <div className="flex justify-center mt-16">
        <div className="flex gap-4">
          <ArrowDownIcon className="w-4" />
          <div>{dict.mainPage.painPoints.betterWayText}</div>
        </div>
      </div>
    </section>
  );
};
