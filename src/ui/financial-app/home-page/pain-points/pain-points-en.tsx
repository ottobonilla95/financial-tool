import { AppDictionary } from "@/src/translations";
import React from "react";
import { ArrowDownIcon } from "@heroicons/react/20/solid";

export type PainPointsEnProps = {
  dict: AppDictionary;
};

export const PainPointsEn = ({ dict }: PainPointsEnProps) => {
  return (
    <section id="key-features" className="tracking-tight">
      <h2 className="text-2xl sm:text-4xl font-bold text-center mb-5 text-neutral-300">
        Ever found yourself in one of these situations?
      </h2>

      <ul className="space-y-4 list-none text-neutral-400 text-lg">
        <li>
          <div>
            <span className="mr-1">❌ </span>{" "}
            <span className="text-neutral-300 font-bold">
              Your money keeps disappearing,
            </span>{" "}
            and you have no idea where it’s going.
          </div>
        </li>
        <li>
          <div>
            <span className="mr-1">❌ </span> You know{" "}
            <span className="text-neutral-300 font-bold">
              you should be saving more,
            </span>{" "}
            but you’re not sure where to start.
          </div>
        </li>

        <li>
          <div>
            <span className="mr-1">❌ </span> You read financial tips,{" "}
            <span className="text-neutral-300 font-bold">
              but they never seem to fit your real life.
            </span>
          </div>
        </li>

        <li>
          <div>
            <span className="mr-1">❌ </span>{" "}
            <span className="text-neutral-300 font-bold">
              Money feels like a constant source of stress,
            </span>{" "}
            and you never feel in control.
          </div>
        </li>
        <li>
          <div>
            <span className="mr-1">❌ </span> You’ve tried budgeting,{" "}
            <span className="text-neutral-300 font-bold">
              but it always feels like too much work.
            </span>
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
