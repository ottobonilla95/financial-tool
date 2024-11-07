import { AppDictionary } from "@/src/translations";
import React from "react";

export type BenefitsProps = {
  dict: AppDictionary;
};

export const Benefits = ({ dict }: BenefitsProps) => {
  return (
    <section
      id="key-features"
      className="text-neutral-100 px-4 md:px-0 tracking-tight mb-16 sm:mb-32 flex justify-center"
    >
      <div className="sm:max-w-[800px]">
        <h2 className="text-3xl sm:text-5xl font-bold mb-8">
          {dict.mainPage.benefits.title}
        </h2>
        <ul className="space-y-6">
          {dict.mainPage.benefits.items.map((benefit, index) => (
            <li key={index} className="flex items-start">
              <p className="flex-1">
                <strong className="text-lime-400">{benefit.title}:</strong>{" "}
                {benefit.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
