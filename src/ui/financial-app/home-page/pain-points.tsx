import { AppDictionary } from "@/src/translations";
import React from "react";
import { ArrowDownIcon } from "@heroicons/react/20/solid";

export type PainPointsProps = {
  lang: string;
  dict: AppDictionary;
};

export const PainPoints = ({ lang, dict }: PainPointsProps) => {
  if (lang === "es") {
    return (
      <section id="key-features" className="tracking-tight bg-neutral-900">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-2 text-center text-white">
          SEAMOS HONESTOS
        </h2>
        <div className="mb-4 text-lg leading-7 text-neutral-400">
          Llevar tus finanzas sin una herramienta adecuada es un caos.{" "}
          <span className="text-white font-bold">
            Ganas dinero, pero al final del mes no sabes en qué se fue.
          </span>{" "}
          Intentas ahorrar, pero siempre hay un gasto imprevisto.{" "}
          <span className="text-white font-bold">
            {" "}
            Quieres mejorar tus finanzas, pero sientes que nunca avanzas.
          </span>
        </div>
        <ul className="space-y-4 list-none text-neutral-400 text-lg">
          <li className="">
            <div className="">
              <span className="mr-1">❌ </span>{" "}
              <span className="text-white font-bold">
                Tu dinero desaparece sin darte cuenta,
              </span>{" "}
              y no sabes por qué.
            </div>
          </li>
          <li className="">
            <div className="">
              <span className="mr-1">❌ </span> Intentas presupuestar,{" "}
              <span className="text-white font-bold">
                pero es un dolor de cabeza y nunca lo sigues.
              </span>
            </div>
          </li>
          <li className="">
            <div className="">
              <span className="mr-1">❌ </span> Lees consejos financieros,{" "}
              <span className="text-white font-bold">
                pero no logras aplicarlos a tu realidad.
              </span>
            </div>
          </li>
          <li className="">
            <div className="">
              <span className="mr-1">❌ </span> Sientes que{" "}
              <span className="text-white font-bold">
                deberías estar ahorrando más, pero no sabes cómo.
              </span>
            </div>
          </li>
          <li className="">
            <div className="">
              <span className="mr-1">❌ </span>{" "}
              <span className="text-white font-bold">
                El estrés por el dinero es constante,
              </span>{" "}
              y no tienes control real sobre él.
            </div>
          </li>
          <li className="">
            <div className="">
              <span className="mr-1">❌ </span>{" "}
              <span className="text-white font-bold">
                Intentas organizarte,
              </span>{" "}
              pero terminas improvisando y gastando más de la
              cuenta.
            </div>
          </li>
        </ul>
        <div className="flex justify-center text-white font-bold text-xl py-10">
          <div className="flex gap-4">
            <ArrowDownIcon className="w-4" />
            <div>{dict.mainPage.painPoints.betterWayText}</div>
          </div>
        </div>
      </section>
    );
  }
  return null;
};
