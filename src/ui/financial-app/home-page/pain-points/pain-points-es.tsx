import { AppDictionary } from "@/src/translations";
import React from "react";
import { ArrowDownIcon } from "@heroicons/react/20/solid";

export type PainPointsEsProps = {
  dict: AppDictionary;
};

export const PainPointsEs = ({ dict }: PainPointsEsProps) => {
  return (
    <section id="key-features" className="tracking-tight">
      <h2 className="text-2xl sm:text-4xl font-bold text-center mb-5 text-neutral-300">
        Te identificas con alguna de estas situaciones?
      </h2>
      <ul className="space-y-4 list-none text-neutral-400 text-lg">
        <li>
          <div>
            <span className="mr-1">❌ </span>{" "}
            <span className="text-neutral-300 font-bold">
              Tu dinero desaparece sin darte cuenta,
            </span>{" "}
            y no sabes por qué.
          </div>
        </li>
        <li>
          <div>
            <span className="mr-1">❌ </span> Sientes que{" "}
            <span className="text-neutral-300 font-bold">
              deberías estar ahorrando más, pero no sabes cómo.
            </span>
          </div>
        </li>
        <li>
          <div>
            <span className="mr-1">❌ </span>{" "}
            <span className="text-neutral-300 font-bold">
              El estrés por el dinero es constante,
            </span>{" "}
            y no tienes control real sobre él.
          </div>
        </li>
      </ul>
      <div className="flex justify-center text-neutral-300 font-bold text-xl py-10">
        <div className="flex gap-4">
          <ArrowDownIcon className="w-4" />
          <div>{dict.mainPage.painPoints.betterWayText}</div>
        </div>
      </div>
    </section>
  );
};
