import React from "react";
import { Button } from "../../../components";

export const YourRelationWithMoneyWillChangeEs = () => {
  return (
    <section id="key-features" className="tracking-tight">
      <h2 className="text-2xl font-bold mb-6 text-center">
        ¿Y si te dijera que hay una forma fácil de tomar el control de tu dinero
        en minutos?
      </h2>
      <p className="text-lg mb-6">
        <strong>TrackMySpend</strong> te da la claridad financiera que siempre
        necesitaste.
      </p>
      <ul className="text-lg mb-6 space-y-4 text-left inline-block">
        <li>
          ✅{" "}
          <span>
            <strong>Descubre en qué gastas tu dinero</strong> y encuentra
            oportunidades de ahorro.
          </span>
        </li>
        <li>
          ✅ <strong>Eliminarás el estrés</strong> de no saber si te alcanza
          hasta fin de mes.
        </li>
        <li>
          ✅{" "}
          <span>
            <strong>Recibe consejos personalizados de IA</strong> basados en tus
            hábitos y emociones.
          </span>
        </li>

        <li>
          ✅{" "}
          <span>
            <strong>Identifica patrones ocultos</strong> en tus finanzas y toma
            mejores decisiones.
          </span>
        </li>
      </ul>
      <h3 className="text-xl font-semibold mb-4 text-center">
        💡 Imagina esto:
      </h3>
      <p className="text-lg mb-6">
        ❌ <strong>Antes:</strong> Revisando tu cuenta bancaria sin idea de
        dónde se fue tu dinero.
      </p>
      <p className="text-lg mb-6">
        ✅ <strong>Después:</strong> Teniendo total claridad sobre tus finanzas,
        ahorrando más y sin preocupaciones.
      </p>
      <p className="text-lg mb-6 font-semibold text-red-600 text-center">
        📌 Es hora de tomar el control de tus finanzas y transformar tu futuro.
      </p>
      <Button
        className="!py-10 !font-bold mt-4 !text-xl group rounded-lg bg-[#1cde98] font-medium text-black hover:opacity-70 focus-visible:outline-black active:opacity-80 border-0 min-w-[300px]"
        iconPosition="left"
        href="#offer"
      >
        👉 Empieza hoy y cambia tu vida financiera
      </Button>
    </section>
  );
};
