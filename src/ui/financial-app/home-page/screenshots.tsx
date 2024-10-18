import { AppDictionary } from "@/src/translations";
import React from "react";

export type AppScreenshotsProps = { dict: AppDictionary };

export const AppScreenshots = ({ dict }: AppScreenshotsProps) => {
  const screenshots = [
    {
      image:
        "https://res.cloudinary.com/dav4ntxrq/image/upload/v1727800164/screenshots/zfbkumwap7tvyk3ijj5q.png",
      alt: dict.mainPage.screenShots.screenshot1.description,
      caption: dict.mainPage.screenShots.screenshot1.description,
    },
    {
      image:
        "https://res.cloudinary.com/dav4ntxrq/image/upload/v1727800164/screenshots/bnchcbmvl9hlhjhjhv9s.png",
      alt: dict.mainPage.screenShots.screenshot2.description,
      caption: dict.mainPage.screenShots.screenshot2.description,
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-0 text-neutral-100 tracking-tight">
      <div className="container mx-auto text-center">
        <h2 className="text-5xl font-bold mb-10">
          {dict.mainPage.screenShots.title}
        </h2>
        <p className="mb-6 text-lg opacity-80">
          {dict.mainPage.screenShots.description}
        </p>
        <div className="flex gap-8 justify-center items-center flex-col sm:flex-row">
          {screenshots.map((screenshot, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg w-full max-w-[400px]"
            >
              <img
                src={screenshot.image}
                alt={screenshot.alt}
                className="w-full h-auto rounded-lg mb-4"
              />
              <p className="text-gray-600">{screenshot.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
