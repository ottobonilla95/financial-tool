import { AppDictionary } from "@/src/translations";
import React from "react";

export type KeyFeaturesProps = {
  dict: AppDictionary;
};
export const KeyFeatures = ({ dict }: KeyFeaturesProps) => {
  const features = [
    {
      icon: "https://res.cloudinary.com/dav4ntxrq/image/upload/v1727799472/icons/ex4iy2wwq6j8i44q9goi.png",
      title: dict.mainPage.keyFeatures.feature1.title,
      description: dict.mainPage.keyFeatures.feature1.description,
    },
    {
      icon: "https://res.cloudinary.com/dav4ntxrq/image/upload/v1727799472/icons/o0fzcxajg9iy4lk5cm8h.png",
      title: dict.mainPage.keyFeatures.feature2.title,
      description: dict.mainPage.keyFeatures.feature2.description,
    },
    {
      icon: "https://res.cloudinary.com/dav4ntxrq/image/upload/v1727799473/icons/axnikgrcijzgamcjqzvl.png",
      title: dict.mainPage.keyFeatures.feature3.title,
      description: dict.mainPage.keyFeatures.feature3.description,
    },
    // {
    //   icon: "https://res.cloudinary.com/dav4ntxrq/image/upload/v1727799472/icons/mdjeeynrsmu6dwshghku.png",
    //   title: "Personalized Alerts",
    //   description:
    //     "Receive custom alerts to help you stay on track with your spending and savings goals. From overspending warnings to congratulatory messages for saving more, we keep you informed.",
    // },
    // {
    //   icon: "https://res.cloudinary.com/dav4ntxrq/image/upload/v1727799473/icons/gimpxj90fosahuvbt2rb.png",
    //   title: "Reminders for Financial Discipline",
    //   description:
    //     "Never miss a bill or savings goal again with built-in reminders tailored to your schedule.",
    // },
  ];

  return (
    <section
      id="key-features"
      className="text-neutral-100 px-4 md:px-0 text-center tracking-tight"
    >
      <h2 className="text-4xl md:text-5xl font-bold mb-10">
        {dict.mainPage.keyFeatures.title}
      </h2>
      <p className="mb-10 text-lg opacity-80">
        {dict.mainPage.keyFeatures.description}
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="p-8 flex items-center flex-col">
            <img
              className="w-[100px] mb-4 bg-lime-400 rounded-md"
              src={feature.icon}
            />
            <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
            <p className="">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
