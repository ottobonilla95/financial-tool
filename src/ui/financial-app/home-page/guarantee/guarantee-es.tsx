import React from "react";
import { ShieldCheckIcon } from "@heroicons/react/24/solid";

export const GuaranteeSectionEs = () => {
  return (
    <section id="guarantee" className="tracking-tight text-center bg-gray-100">
      <div className="flex justify-center">
        <img
          src={`/images/guarantee/30-days-guarantee-es.png`}
          alt="Garantía de 7 días"
          className="w-full mb-6 sm:max-w-[300px]"
        />
      </div>

      <h2 className="text-3xl font-bold mb-6">Garantía de Satisfacción</h2>
      <p className="text-lg mb-6">
        Estamos seguros de que TrackMySpend{" "}
        <span className="font-bold">
          transformará tu manera de manejar el dinero
        </span>
        . Por eso, garantizamos que si en 15 días no ves el valor que esperabas,
        te devolveremos <span className="font-bold">cada centavo</span>, sin
        preguntas ni trámites innecesarios.
      </p>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <ShieldCheckIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-semibold mb-4">🚀 Accede sin riesgos</h3>
        <p className="text-gray-600 mb-6">
          <strong>Nuestro compromiso es tu tranquilidad.</strong> Puedes probar{" "}
          <strong>TrackMySpend</strong> sin preocupaciones y tomar el control de
          tus finanzas con total confianza.
        </p>
        <p className="text-gray-600 mb-6">
          <span className="font-bold">El único riesgo</span> que corres es
          seguir perdiendo el control de tu dinero. ¡Es tu momento de cambiarlo!
        </p>
      </div>
    </section>
  );
};
