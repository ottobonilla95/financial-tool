import React from "react";
import { Button } from "../../components";

export const PricingOfferSection = () => {
  return (
    <section
      id="pricing-offer"
      className="tracking-tight px-6 py-12 text-center bg-gray-100"
    >
      <h2 className="text-3xl font-bold mb-6">
        Accede a TrackMySpend de por vida
      </h2>
      <p className="text-lg mb-6">
        Un solo pago.<span className="font-bold"> Sin suscripciones.</span>{" "}
        Control total de tus finanzas para siempre.
      </p>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4 text-red-600">
          🔥 Oferta por Tiempo Limitado
        </h3>
        <p className="text-lg text-gray-700 mb-4">
          Precio regular: <span className="line-through">$149 USD</span>
        </p>
        <p className="text-4xl font-bold text-green-600 mb-4">Ahora: $99 USD</p>
        <p className="text-gray-600 mb-6">
          Pago único. Acceso de por vida. Todas las funciones incluidas.
        </p>

        <Button className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition">
          🚀 Obtener Oferta Ahora
        </Button>
      </div>
    </section>
  );
};
