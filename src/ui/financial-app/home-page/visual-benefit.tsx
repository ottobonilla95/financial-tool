import { AppDictionary } from "@/src/translations";
import React from "react";

export type VisualBenefitProps = {
  dict: AppDictionary;
};

export const VisualBenefit = ({ dict }: VisualBenefitProps) => {
  return (
    <section
      id="key-features"
      className="text-neutral-100 px-4 md:px-0 tracking-tight flex flex-col md:flex-row space-y-4 md:space-x-8 justify-center mt-4"
    >
      <div className="flex items-center flex-col space-y-6">
        <div className="text-3xl md:text-4xl font-bold">
          {dict.mainPage.visualBenefit.changeFrom}
        </div>
        <img
          src="https://res.cloudinary.com/dav4ntxrq/image/upload/v1731011542/app%20images/k5ndgd55vy59n4mcxzo0.gif"
          className="w-[500px] rounded-md"
        />
      </div>
      <div className="flex hidden md:flex items-center">
        <img
          src="https://res.cloudinary.com/dav4ntxrq/image/upload/v1731012478/app%20images/arrows/uv4d1jfqe3caenzgq083.png"
          className="w-[200px] rotate"
        />
      </div>
      <div className="flex md:hidden justify-center">
        <img
          src="https://res.cloudinary.com/dav4ntxrq/image/upload/v1731012478/app%20images/arrows/uqrwofn2lws45onhszkq.png"
          className="w-[100px] rotate-90"
        />
      </div>
      <div className="flex items-center flex-col space-y-6">
        <div className="hidden md:flex text-3xl md:text-4xl font-bold">
          {dict.mainPage.visualBenefit.changeTo}
        </div>
        <img
          src="https://res.cloudinary.com/dav4ntxrq/image/upload/v1731014294/app%20images/vdyxz7rwrkxacl0etv43.gif"
          className="w-[500px] rounded-md"
        />
        <div className="flex md:hidden text-3xl md:text-4xl font-bold">
          {dict.mainPage.visualBenefit.changeTo}
        </div>
      </div>
    </section>
  );
};
