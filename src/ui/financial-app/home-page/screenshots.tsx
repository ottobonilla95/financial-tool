import { AppDictionary, AvailableLanguages } from "@/src/translations";
import React from "react";

export type AppScreenshotsProps = {
  dict: AppDictionary;
  lang: AvailableLanguages;
};

export const AppScreenshots = ({ dict, lang }: AppScreenshotsProps) => {
  const es = [
    "https://res.cloudinary.com/dav4ntxrq/image/upload/v1730452215/screenshots/es/reaezau4feyn0udxufzd.png",
    "https://res.cloudinary.com/dav4ntxrq/image/upload/v1730452215/screenshots/es/swrgmjnbqj81waaflltp.png",
    "https://res.cloudinary.com/dav4ntxrq/image/upload/v1730452215/screenshots/es/bblkc0pzwwdkrncj6wlg.png",
    "https://res.cloudinary.com/dav4ntxrq/image/upload/v1730452214/screenshots/es/mjm3w2ayt7ozxnlt3sup.png",
    "https://res.cloudinary.com/dav4ntxrq/image/upload/v1730452215/screenshots/es/lt0wwf9bddqq3ojptzvh.png",
    "https://res.cloudinary.com/dav4ntxrq/image/upload/v1730452215/screenshots/es/rbeqw2mr9ub2735df93g.png",
    "https://res.cloudinary.com/dav4ntxrq/image/upload/v1730452215/screenshots/es/ubowslkpi6vklh5gffxr.png",
    "https://res.cloudinary.com/dav4ntxrq/image/upload/v1730452215/screenshots/es/yd42hzxgttflpbyho5uc.png",
  ];

  const en = [
    "https://res.cloudinary.com/dav4ntxrq/image/upload/v1730452186/screenshots/en/oawrxwrkg4gv48iaexfp.png",
    "https://res.cloudinary.com/dav4ntxrq/image/upload/v1730452186/screenshots/en/uj97sv0gywdxc19vjs7s.png",
    "https://res.cloudinary.com/dav4ntxrq/image/upload/v1730452187/screenshots/en/fhwjybzfrihnqw6khzmi.png",
    "https://res.cloudinary.com/dav4ntxrq/image/upload/v1730452187/screenshots/en/swlrwhwlgzmw0hcoqehn.png",
    "https://res.cloudinary.com/dav4ntxrq/image/upload/v1730452187/screenshots/en/r9qhbsgewh9gbylzzjxc.png",
    "https://res.cloudinary.com/dav4ntxrq/image/upload/v1730452187/screenshots/en/twkocwfxhp6riu1gledj.png",
    "https://res.cloudinary.com/dav4ntxrq/image/upload/v1730452186/screenshots/en/u0mynh6ueucefhqoh9lp.png",
    "https://res.cloudinary.com/dav4ntxrq/image/upload/v1730452186/screenshots/en/ni170ukmninydkcgvnjt.png",
  ];

  const screenshots = [
    {
      image: lang === "es" ? es[0] : en[0],
      alt: dict.mainPage.screenShots.screenshot1.description,
      caption: dict.mainPage.screenShots.screenshot1.description,
    },
    {
      image: lang === "es" ? es[1] : en[1],
      alt: dict.mainPage.screenShots.screenshot2.description,
      caption: dict.mainPage.screenShots.screenshot2.description,
    },
    {
      image: lang === "es" ? es[2] : en[2],
      alt: dict.mainPage.screenShots.screenshot3.description,
      caption: dict.mainPage.screenShots.screenshot3.description,
    },
    {
      image: lang === "es" ? es[3] : en[3],
      alt: dict.mainPage.screenShots.screenshot4.description,
      caption: dict.mainPage.screenShots.screenshot4.description,
    },
    {
      image: lang === "es" ? es[4] : en[4],
      alt: dict.mainPage.screenShots.screenshot5.description,
      caption: dict.mainPage.screenShots.screenshot5.description,
    },
    {
      image: lang === "es" ? es[5] : en[5],
      alt: dict.mainPage.screenShots.screenshot6.description,
      caption: dict.mainPage.screenShots.screenshot6.description,
    },
    {
      image: lang === "es" ? es[6] : en[6],
      alt: dict.mainPage.screenShots.screenshot7.description,
      caption: dict.mainPage.screenShots.screenshot7.description,
    },
    {
      image: lang === "es" ? es[7] : en[7],
      alt: dict.mainPage.screenShots.screenshot8.description,
      caption: dict.mainPage.screenShots.screenshot8.description,
    },
  ];

  return (
    <section className="sm:py-16 px-4 sm:px-0 text-neutral-100 tracking-tight">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-bold mb-10">
          {dict.mainPage.screenShots.title}
        </h2>
        <p className="mb-6 text-lg opacity-80">
          {dict.mainPage.screenShots.description}
        </p>
        <div className="flex gap-2 justify-center items-center flex-col sm:flex-row flex-wrap">
          {screenshots.map((screenshot, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg w-full max-w-[400px]"
            >
              <img
                src={screenshot.image}
                alt={screenshot.alt}
                className="w-full h-auto rounded-sm mb-4"
              />
              <p className="text-gray-600">{screenshot.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
