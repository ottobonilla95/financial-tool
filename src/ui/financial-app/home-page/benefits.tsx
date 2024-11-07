import { AppDictionary } from "@/src/translations";
import React from "react";
import { ArrowDownIcon } from "@heroicons/react/20/solid";

export type BenefitsProps = {
  dict: AppDictionary;
};
export const Benefits = ({ dict }: BenefitsProps) => {
  return (
    <section
      id="key-features"
      className="text-neutral-100 px-4 md:px-0 tracking-tight mb-32 flex justify-center"
    >
      <div className="max-w-[800px]">
        <h2 className="text-4xl sm:text-5xl font-bold mb-8">
          Gestiona tu dinero como un experto y alcanza tus metas financieras!
        </h2>
        <ul className="space-y-6">
          <li className="flex items-start">
            <p className="flex-1">
              <strong className="text-lime-300">
                Visión Financiera Clara:
              </strong>{" "}
              Comprende en qué se va cada peso y ten una visión completa de tu
              situación financiera.
            </p>
          </li>
          <li className="flex items-start">
            <p className="flex-1">
              <strong className="text-lime-300">
                Aumenta tus Ahorros y Reduce Deudas:
              </strong>{" "}
              Establece metas de ahorro, evita gastos innecesarios y trabaja
              para salir de deudas de forma constante.
            </p>
          </li>
          <li className="flex items-start">
            <p className="flex-1">
              <strong className="text-lime-300">
                Conciencia sobre el Gasto Emocional:
              </strong>{" "}
              Descubre patrones de gasto ligados a tus emociones, como las
              compras impulsivas, y toma decisiones más conscientes.
            </p>
          </li>
          <li className="flex items-start">
            <p className="flex-1">
              <strong className="text-lime-300">
                Tranquilidad Financiera:
              </strong>{" "}
              Reduce el estrés financiero sabiendo que tienes un plan claro y
              estás en control de tu dinero.
            </p>
          </li>
          <li className="flex items-start">
            <p className="flex-1">
              <strong className="text-lime-300">
                Hábitos de Gasto Saludables:
              </strong>{" "}
              Identifica y mejora tus hábitos de gasto para lograr una vida
              financiera más equilibrada y satisfactoria.
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
};
