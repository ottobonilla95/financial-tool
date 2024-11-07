import { AppDictionary } from "@/src/translations";
import React from "react";
import { ArrowDownIcon } from "@heroicons/react/20/solid";

export type PainPointsProps = {
  dict: AppDictionary;
};
export const PainPoints = ({ dict }: PainPointsProps) => {
  return (
    <section
      id="key-features"
      className="text-neutral-100 px-4 md:px-0 tracking-tight my-32 text-center bg-neutral-900 py-16"
    >
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">
        Desventajas de no tener una herramienta financiera
      </h2>
      <ul className="space-y-4 list-disc">
        <li className="flex items-start">
          <p className="flex-1">
            <strong>
              Falta de <span className="text-red-300"> conciencia</span>{" "}
              financiera
            </strong>
          </p>
        </li>
        <li className="flex items-start">
          <p className="flex-1">
            <strong>
              Oportunidades de ahorro{" "}
              <span className="text-red-300"> perdidas</span>{" "}
            </strong>
          </p>
        </li>
        <li className="flex items-start">
          <p className="flex-1">
            <strong>
              {" "}
              <span className="text-red-300"> Dificultad</span> para
              presupuestar
            </strong>
          </p>
        </li>
        <li className="flex items-start">
          <p className="flex-1">
            <strong>
              Falta de <span className="text-red-300"> visión</span> sobre los
              hábitos de gasto
            </strong>
          </p>
        </li>
        <li className="flex items-start">
          <p className="flex-1">
            <strong>
              Aumento del <span className="text-red-300"> estrés</span>{" "}
              financiero
            </strong>
          </p>
        </li>
        <li className="flex items-start">
          <p className="flex-1">
            <strong>
              Progreso <span className="text-red-300"> inconsistente</span> en
              tus metas
            </strong>
          </p>
        </li>
        <li className="flex items-start">
          <p className="flex-1">
            <strong>
              Mayor riesgo de acumular{" "}
              <span className="text-red-300"> deudas</span>{" "}
            </strong>
          </p>
        </li>
        <li className="flex items-start">
          <p className="flex-1">
            <strong>
              {" "}
              <span className="text-red-300"> Falta</span> de crecimiento
              financiero
            </strong>
          </p>
        </li>
      </ul>
      <div className="flex justify-center mt-16">
        <div className="flex gap-4">
          <ArrowDownIcon className="w-4" />
          <div>Hay una mejor forma</div>
        </div>
      </div>
    </section>
  );
};
