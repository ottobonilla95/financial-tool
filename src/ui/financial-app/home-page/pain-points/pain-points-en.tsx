import { AppDictionary } from "@/src/translations";
import React from "react";
import { ArrowDownIcon } from "@heroicons/react/20/solid";

export type PainPointsEnProps = {
  dict: AppDictionary;
};

export const PainPointsEn = ({ dict }: PainPointsEnProps) => {
  return (
    <section id="key-features" className="tracking-tight">
      <h2 className="text-2xl sm:text-4xl font-bold text-center mb-5 text-center text-neutral-300">
        Do you relate to any of these situations?
      </h2>

      <ul className="space-y-4 list-none text-neutral-400 text-lg">
        <li>
          <div>
            <span className="mr-1">❌ </span>{" "}
            <span className="text-neutral-300 font-bold">
              Your money disappears without you realizing it,
            </span>{" "}
            and you don’t know why.
          </div>
        </li>
        <li>
          <div>
            <span className="mr-1">❌ </span> You feel like{" "}
            <span className="text-neutral-300 font-bold">
              you should be saving more, but you don’t know how.
            </span>
          </div>
        </li>

        <li>
          <div>
            <span className="mr-1">❌ </span> You read financial advice,{" "}
            <span className="text-neutral-300 font-bold">
              but you can't apply it to your reality.
            </span>
          </div>
        </li>

        <li>
          <div>
            <span className="mr-1">❌ </span>{" "}
            <span className="text-neutral-300 font-bold">
              Money stress is constant,
            </span>{" "}
            and you don’t have real control over it.
          </div>
        </li>
        <li>
          <div>
            <span className="mr-1">❌ </span> You try to budget,{" "}
            <span className="text-neutral-300 font-bold">
              but it’s a headache, and you never stick to it.
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
