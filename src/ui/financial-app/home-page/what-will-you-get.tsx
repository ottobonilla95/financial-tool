import { AppDictionary } from "@/src/translations";
import React from "react";

export type WhatWillYouGetProps = {
  dict: AppDictionary;
};

export const WhatWillYouGet = ({ dict }: WhatWillYouGetProps) => {
  return (
    <section
      id="key-features"
      className="text-neutral-100 tracking-tight mb-16 sm:mb-32 flex justify-center"
    >
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
          <span> {dict.mainPage.whatWillYouGet.title1}</span>{" "}
          <span className="relative">
            {dict.mainPage.whatWillYouGet.title2}
            <span className="absolute left-0 bottom-0 w-full h-1 bg-lime-400 rounded-full"></span>
          </span>{" "}
          <span> {dict.mainPage.whatWillYouGet.title3}</span>
        </h2>
        <ul className="space-y-6">
          {dict.mainPage.whatWillYouGet.items.map((item, index) => (
            <li key={index} className="flex items-start">
              <p className="flex-1 text-lg sm:text-2xl">
                <strong className="font-extrabold">{item.title}:</strong>{" "}
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
