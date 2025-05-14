import React from "react";
import { Button } from "../../../components";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { GiftIcon } from "@heroicons/react/24/outline";

export type PricingOfferSectionProps = {
  campaign?: string;
};
export const PricingOfferSectionEs = ({
  campaign,
}: PricingOfferSectionProps) => {
  let hotmartCheckoutUrl = process.env.HOTMART_CHECKOUT_URL_ES;

  if (campaign) {
    hotmartCheckoutUrl = `${hotmartCheckoutUrl}&sck=${campaign}`;
  }

  return (
    <section
      id="pricing-offer"
      className="tracking-tight px-5 py-12 bg-neutral-100 rounded-md"
    >
      <h2 className="text-3xl font-bold mb-6 text-center">
        🚀 Accede a TrackMySpend de por vida
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
            <div className="bg-gray-100 rounded-lg p-4 mb-6 text-center">
              <p className="text-sm text-gray-600">Imagen Próximamente</p>
              <p className="text-xs text-gray-500">Vista Previa del Software</p>
            </div>
          </div>
          <div className="flex-1">
            <ul className="space-y-3">
              <li className="flex">
                <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
                <div className="flex-1">
                  Software de registro detallado de gastos, ingresos y ahorros
                </div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
                <div className="flex-1">
                  Gráficos avanzados para visualizar tu dinero de manera inteligente
                </div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
                <div className="flex-1">
                  Comparación de gastos mes a mes
                </div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
                <div className="flex-1">
                  Análisis detallado de gastos por categoría y por día
                </div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
                <div className="flex-1">
                  Soporte multi-moneda para gestión global del dinero
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Gift Section 1 - Premium Features */}
      <div className="mb-12 p-6 bg-white rounded-xl shadow-sm border-2 border-dashed border-green-200">
        <div className="flex items-center justify-center mb-4">
          <GiftIcon className="w-8 h-8 text-green-500 mr-2" />
          <h3 className="text-xl font-bold">Regalo #1: Funciones Premium</h3>
        </div>
        <p className="text-center mb-6 text-gray-600">
          <span className="line-through text-red-600">Valor: $210 USD</span>{" "}
          <span className="text-green-600 font-bold">Gratis por Siempre</span>
        </p>
        <ul className="space-y-3">
          <li className="flex">
            <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
            <div className="flex-1">
              Módulo de psicología: Comprende tus emociones y niveles de satisfacción en gastos
            </div>
          </li>
          <li className="flex">
            <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
            <div className="flex-1">
              Asistente de IA con consejos financieros personalizados
            </div>
          </li>
          <li className="flex">
            <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
            <div className="flex-1">
              Soporte prioritario por email y solicitud de funciones
            </div>
          </li>
          <li className="flex">
            <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
            <div className="flex-1">
              Actualizaciones y nuevas funciones de por vida
            </div>
          </li>
        </ul>
      </div>

      {/* Gift Section 2 - First eBook */}
      <div className="mb-12 p-6 bg-white rounded-xl shadow-sm border-2 border-dashed border-green-200">
        <div className="flex items-center justify-center mb-4">
          <GiftIcon className="w-8 h-8 text-green-500 mr-2" />
          <h3 className="text-xl font-bold">Regalo #2: [Título eBook 1]</h3>
        </div>
        <p className="text-center mb-6 text-gray-600">
          <span className="line-through text-red-600">Valor: $29 USD</span>{" "}
          <span className="text-green-600 font-bold">Gratis</span>
        </p>
        
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/3">
            <div className="bg-gray-100 rounded-lg p-4 mb-4 aspect-[3/4]">
              <p className="text-sm text-gray-600">Portada eBook</p>
              <p className="text-xs text-gray-500">Próximamente</p>
            </div>
          </div>
          <div className="md:w-2/3">
            <p className="text-lg mb-4">
              [Breve descripción del eBook 1 y sus beneficios. Lo que el lector aprenderá y cómo le ayudará con sus finanzas.]
            </p>
            <ul className="space-y-2">
              <li className="flex">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                <div className="flex-1">Beneficio clave 1</div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                <div className="flex-1">Beneficio clave 2</div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                <div className="flex-1">Beneficio clave 3</div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Gift Section 3 - Second eBook */}
      <div className="mb-12 p-6 bg-white rounded-xl shadow-sm border-2 border-dashed border-green-200">
        <div className="flex items-center justify-center mb-4">
          <GiftIcon className="w-8 h-8 text-green-500 mr-2" />
          <h3 className="text-xl font-bold">Regalo #3: [Título eBook 2]</h3>
        </div>
        <p className="text-center mb-6 text-gray-600">
          <span className="line-through text-red-600">Valor: $29 USD</span>{" "}
          <span className="text-green-600 font-bold">Gratis</span>
        </p>
        
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/3">
            <div className="bg-gray-100 rounded-lg p-4 mb-4 aspect-[3/4]">
              <p className="text-sm text-gray-600">Portada eBook</p>
              <p className="text-xs text-gray-500">Próximamente</p>
            </div>
          </div>
          <div className="md:w-2/3">
            <p className="text-lg mb-4">
              [Breve descripción del eBook 2 y sus beneficios. Lo que el lector aprenderá y cómo le ayudará con sus finanzas.]
            </p>
            <ul className="space-y-2">
              <li className="flex">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                <div className="flex-1">Beneficio clave 1</div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                <div className="flex-1">Beneficio clave 2</div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                <div className="flex-1">Beneficio clave 3</div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Gift Section 4 - Third eBook */}
      <div className="mb-12 p-6 bg-white rounded-xl shadow-sm border-2 border-dashed border-green-200">
        <div className="flex items-center justify-center mb-4">
          <GiftIcon className="w-8 h-8 text-green-500 mr-2" />
          <h3 className="text-xl font-bold">Regalo #4: [Título eBook 3]</h3>
        </div>
        <p className="text-center mb-6 text-gray-600">
          <span className="line-through text-red-600">Valor: $29 USD</span>{" "}
          <span className="text-green-600 font-bold">Gratis</span>
        </p>
        
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/3">
            <div className="bg-gray-100 rounded-lg p-4 mb-4 aspect-[3/4]">
              <p className="text-sm text-gray-600">Portada eBook</p>
              <p className="text-xs text-gray-500">Próximamente</p>
            </div>
          </div>
          <div className="md:w-2/3">
            <p className="text-lg mb-4">
              [Breve descripción del eBook 3 y sus beneficios. Lo que el lector aprenderá y cómo le ayudará con sus finanzas.]
            </p>
            <ul className="space-y-2">
              <li className="flex">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                <div className="flex-1">Beneficio clave 1</div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                <div className="flex-1">Beneficio clave 2</div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                <div className="flex-1">Beneficio clave 3</div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Total Value & Call to Action */}
      <div className="text-center bg-green-50 rounded-xl p-8 mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-red-600">
          🔴 Oferta Especial por Tiempo Limitado
        </h3>
        <div className="mb-6">
          <div className="mb-4">
            <p className="text-base text-gray-600 mb-1">Valor Total del Paquete:</p>
            <ul className="text-sm text-gray-600 space-y-1 mb-3">
              <li>Software TrackMySpend: $57</li>
              <li>Pack de Funciones Premium: $147</li>
              <li>3 eBooks Financieros: $87</li>
            </ul>
            <p className="text-lg font-medium text-gray-700">
              Precio Regular: <span className="line-through">$291 USD</span>
            </p>
          </div>
          <p className="text-4xl font-bold text-green-600 mb-2">
            Hoy: $47 USD
          </p>
          <p className="text-gray-600">
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
            🔥 Acceder Ahora
          </Button>
        </div>
      </div>
    </section>
  );
};
