import React from "react";
import { Button } from "../../../components";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export type PricingOfferSectionProps = {
  campaign?: string;
  fbclid?: string;
};

export const PricingOfferSectionEs = ({
  campaign,
  fbclid,
}: PricingOfferSectionProps) => {
  let hotmartCheckoutUrl = process.env.HOTMART_CHECKOUT_URL_ES;

  if (campaign) {
    hotmartCheckoutUrl = `${hotmartCheckoutUrl}&sck=${campaign}`;
  }

  if (fbclid) {
    hotmartCheckoutUrl = `${hotmartCheckoutUrl}&fbclid=${fbclid}`;
  }

  return (
    <section
      id="pricing-offer"
      className="tracking-tight px-5 py-12 bg-neutral-100 rounded-md"
    >
      <h2 className="text-3xl font-bold mb-6 text-center">
        Accede a TrackMySpend de por vida
      </h2>
      <p className="text-lg mb-10 sm:text-center">
        Un solo pago.<span className="font-bold"> Sin suscripciones.</span>{" "}
        Control total de tus finanzas para siempre.
      </p>

      {/* Main Product Section */}
      <div className="mb-12 p-6 bg-white rounded-xl shadow-sm">
        <h3 className="text-2xl font-bold mb-6 text-center">
          TrackMySpend - Sistema Completo de Control Financiero
        </h3>

        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex-1">
            <img
              src="/images/vslgif2.gif"
              alt="TrackMySpend Preview"
              className="rounded-lg w-full"
            />
          </div>
          <div className="flex-1">
            <ul className="space-y-3">
              <li className="flex">
                <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                <div className="flex-1">
                  Software de registro detallado de gastos, ingresos y ahorros
                </div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                <div className="flex-1">
                  Gráficos avanzados para visualizar tu dinero de manera
                  inteligente
                </div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                <div className="flex-1">Comparación de gastos mes a mes</div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                <div className="flex-1">
                  Análisis detallado de gastos por categoría y por día
                </div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                <div className="flex-1">
                  Soporte multi-moneda para gestión global del dinero
                </div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                <div className="flex-1">
                  Módulo de psicología: Comprende tus emociones y niveles de
                  satisfacción en gastos
                </div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                <div className="flex-1">
                  Asistente de IA con consejos financieros personalizados
                </div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                <div className="flex-1">
                  Soporte prioritario por email y solicitud de funciones
                </div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                <div className="flex-1">
                  Actualizaciones y nuevas funciones de por vida
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-green-50 rounded-xl p-8 mb-8">
        <div className="mb-6">
          <p className="text-4xl font-bold text-green-600 mb-2">$47 USD</p>
          <p className="text-gray-600 text-lg">
            Pago único. Acceso de por vida. Todas las funciones incluidas.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Únete a cientos de usuarios satisfechos transformando sus finanzas
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            className="!py-10 text-center !text-lg bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg !text-2xl transition"
            href={hotmartCheckoutUrl}
          >
            Acceder Ahora
          </Button>
        </div>
      </div>
    </section>
  );
};
