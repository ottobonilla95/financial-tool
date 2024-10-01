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
    <section className="py-16 sm:py-24 bg-white px-4 sm:px-0">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-10">How TrackMySpend Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-lg shadow-lg">
              <span className="text-6xl font-bold  mb-4 block">
                {step.number}
              </span>
              <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
