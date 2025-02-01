import { AppDictionary } from "@/src/translations";
import React from "react";
import { Button } from "../../components";
import { FireIcon } from "@heroicons/react/24/solid";

export type YourRelationWithMoneyWillChangeProps = {
  dict: AppDictionary;
  lang: string;
};

export const YourRelationWithMoneyWillChange = ({
  dict,
  lang,
}: YourRelationWithMoneyWillChangeProps) => {
  return (
    <section id="key-features" className="tracking-tight">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Tu relación con el dinero está a punto de cambiar
      </h2>
      <p className="text-lg mb-6">
        Has intentado presupuestar, ahorrar, seguir consejos financieros… pero
        nada parece funcionar.
        <strong>
          {" "}
          ¿Y si te dijera que hay un método simple que puede transformar por
          completo tu vida financiera?
        </strong>
      </p>
      <p className="text-lg mb-6">
        Con <strong>TrackMySpend</strong>, por fin tendrás el control total de
        tu dinero. <br />
        <span className="text-lime-600 font-semibold">
          Sin estrés, sin complicaciones, sin suposiciones.
        </span>
      </p>
      <ul className="text-lg mb-6 space-y-4 text-left inline-block">
        <li>
          📊 <strong>Verás con claridad</strong> a dónde va cada peso.
        </li>
        <li>
          💡 <strong>Descubrirás oportunidades de ahorro</strong> sin esfuerzo.
        </li>
        <li>
          😌 <strong>Eliminarás la ansiedad</strong> de no saber en qué gastas.
        </li>
        <li>
          🎯 <strong>Avanzarás con seguridad</strong> hacia tus metas
          financieras.
        </li>
      </ul>
      <p className="text-lg mb-6 font-semibold text-red-600">
        🔥 Esta es la solución que necesitas. No más excusas, no más
        improvisación.
      </p>
      <p className="text-lg mb-8">
        Es hora de tomar las riendas de tu dinero y transformar tu futuro.
      </p>
      <Button
        className="!py-10 !font-bold mt-4 !text-xl group rounded-lg bg-lime-500 font-medium text-black hover:opacity-70 focus-visible:outline-black active:opacity-80 border-0 min-w-[300px]"
      
        iconPosition="left"
      >
        👉 Empieza hoy y cambia tu vida financiera
      </Button>
    </section>
  );
};
