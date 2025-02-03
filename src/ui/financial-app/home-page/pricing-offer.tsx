import React from "react";
import { Button } from "../../components";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export const PricingOfferSection = () => {
  const hotmartCheckoutUrl = process.env.HOTMART_CHECKOUT_URL;
  return (
    <section
      id="pricing-offer"
      className="tracking-tight px-4 py-12 bg-neutral-100 rounded-md"
    >
      <h2 className="text-3xl font-bold mb-6 text-center">
        🚀 Accede a TrackMySpend de por vida
      </h2>
      <p className="text-lg mb-6 sm:text-center">
        Un solo pago.<span className="font-bold"> Sin suscripciones.</span>{" "}
        Control total de tus finanzas para siempre.
      </p>

      <h3 className="text-xl font-semibold mb-4 sm:text-center">
        Esto es todo lo que recibirás 👇 
      </h3>

      <ul className="text-lg space-y-3 max-w-lg mx-auto">
        <li className="flex">
          <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
          <div className="flex-1">
            Registro detallado de gastos, ingresos y ahorros.
          </div>
        </li>
        <li className="flex">
          <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
          <div className="flex-1">
            Gráficos avanzados para visualizar tu dinero de manera inteligente.
          </div>
        </li>
        <li className="flex">
          <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
          <div className="flex-1">
            Comparación de gastos mes a mes para entender mejor tu evolución
            financiera.
          </div>
        </li>
        <li className="flex">
          <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
          <div className="flex-1">
            Análisis detallado de gastos por categoría y por día.
          </div>
        </li>
        <li className="flex">
          <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
          <div className="flex-1">
            Relación entre tus gastos, emociones y nivel de satisfacción.
          </div>
        </li>
        <li className="flex">
          <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
          <div className="flex-1">
            Asistente de IA que analiza tus finanzas y te da consejos
            personalizados.
          </div>
        </li>
      </ul>

      <h3 className="text-2xl font-semibold mb-4 text-red-600 mt-8 text-center">
        🔴 Últimos Días para Obtener TrackMySpend con un 75% de Descuento
      </h3>
      <p className="text-lg text-gray-700 mb-4 text-center">
        Precio regular: <span className="line-through">$148 USD</span>
      </p>
      <p className="text-4xl font-bold text-green-600 mb-4 text-center">
        Ahora: $37 USD
      </p>
      <p className="text-gray-600 mb-6 text-center">
        Pago único. Acceso de por vida. Todas las funciones incluidas.
      </p>

      <p className="text-lg font-semibold text-red-600 mt-6 text-center">
        ❗ Esta oferta especial desaparecerá pronto. ¡Aprovecha ahora y
        transforma tus finanzas para siempre!
      </p>

      <Button
        className="!py-10 !text-lg bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition mt-6"
        href={hotmartCheckoutUrl}
      >
        🔥 Acceder Ahora – Solo $37 USD (Antes $148)
      </Button>
    </section>
  );
};
