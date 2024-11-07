import { AppDictionary } from "@/src/translations";
import React from "react";

export type HowItWorksProps = {
  dict: AppDictionary;
};

export const HowItWorks = ({ dict }: HowItWorksProps) => {
  const steps = [
    {
      number: "1",
      title: dict.mainPage.howItWorks.step1.title,
      description: dict.mainPage.howItWorks.step1.description,
    },
    {
      number: "2",
      title: dict.mainPage.howItWorks.step2.title,
      description: dict.mainPage.howItWorks.step2.description,
    },
    {
      number: "3",
      title: dict.mainPage.howItWorks.step3.title,
      description: dict.mainPage.howItWorks.step3.description,
    },
    {
      number: "4",
      title: dict.mainPage.howItWorks.step4.title,
      description: dict.mainPage.howItWorks.step4.description,
    },
  ];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-0 text-neutral-100">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-bold mb-10">
          {dict.mainPage.howItWorks.title}
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="p-6 sm:p-8">
              <span className="text-6xl font-bold mb-4 block text-lime-500">
                {step.number}
              </span>
              <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
              <p className="">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
