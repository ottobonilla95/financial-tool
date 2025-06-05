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
            <img
              src="/images/vslgif2.gif"
              alt="TrackMySpend Preview"
              className="rounded-lg w-full"
            />
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
                  Gráficos avanzados para visualizar tu dinero de manera
                  inteligente
                </div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
                <div className="flex-1">Comparación de gastos mes a mes</div>
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
          <span className="line-through text-red-600">Valor: $147 USD</span>{" "}
          <span className="text-green-600 font-bold">Gratis por Siempre</span>
        </p>
        <ul className="space-y-3">
          <li className="flex">
            <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
            <div className="flex-1">
              Módulo de psicología: Comprende tus emociones y niveles de
              satisfacción en gastos
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
          <h3 className="text-xl font-bold">
            Regalo #2: Mentalidad Financiera
          </h3>
        </div>
        <p className="text-center mb-6 text-gray-600">
          <span className="line-through text-red-600">Valor: $29 USD</span>{" "}
          <span className="text-green-600 font-bold">Gratis</span>
        </p>

        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/3">
            <img
              src="/images/ebook/ebook1.png"
              alt="Mentalidad Financiera"
              className="rounded-lg shadow-md w-full aspect-[3/4] object-cover"
            />
          </div>
          <div className="md:w-2/3">
            <p className="text-lg mb-4">
              Descubre cómo desarrollar una mentalidad financiera sólida para
              alcanzar tus metas económicas. Este ebook te guiará en el proceso
              de transformar tu relación con el dinero.
            </p>
            <ul className="space-y-2">
              <li className="flex">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                <div className="flex-1">
                  Desarrolla hábitos de ahorro efectivos
                </div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                <div className="flex-1">
                  Supera los bloqueos mentales que te impiden prosperar
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Gift Section 3 - Second eBook */}
      <div className="mb-12 p-6 bg-white rounded-xl shadow-sm border-2 border-dashed border-green-200">
        <div className="flex items-center justify-center mb-4">
          <GiftIcon className="w-8 h-8 text-green-500 mr-2" />
          <h3 className="text-xl font-bold">
            Regalo #3: 7 Hábitos Clave para Mejorar tus Finanzas Personales
          </h3>
        </div>
        <p className="text-center mb-6 text-gray-600">
          <span className="line-through text-red-600">Valor: $29 USD</span>{" "}
          <span className="text-green-600 font-bold">Gratis</span>
        </p>

        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/3">
            <img
              src="/images/ebook/ebook2.png"
              alt="7 Hábitos Clave para Mejorar tus Finanzas Personales"
              className="rounded-lg shadow-md w-full aspect-[3/4] object-cover"
            />
          </div>
          <div className="md:w-2/3">
            <p className="text-lg mb-4">
              Aprende los hábitos fundamentales que transformarán tu relación
              con el dinero y te ayudarán a alcanzar la libertad financiera.
            </p>
            <ul className="space-y-2">
              <li className="flex">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                <div className="flex-1">
                  Domina el arte del presupuesto efectivo
                </div>
              </li>

              <li className="flex">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                <div className="flex-1">
                  Desarrolla un plan de acción personalizado
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Gift Section 4 - Third eBook */}
      <div className="mb-12 p-6 bg-white rounded-xl shadow-sm border-2 border-dashed border-green-200">
        <div className="flex items-center justify-center mb-4">
          <GiftIcon className="w-8 h-8 text-green-500 mr-2" />
          <h3 className="text-xl font-bold">
            Regalo #4: 21 Ideas para Ganar Dinero Extra desde Casa
          </h3>
        </div>
        <p className="text-center mb-6 text-gray-600">
          <span className="line-through text-red-600">Valor: $29 USD</span>{" "}
          <span className="text-green-600 font-bold">Gratis</span>
        </p>

        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/3">
            <img
              src="/images/ebook/ebook3.png"
              alt="21 Ideas para Ganar Dinero Extra desde Casa"
              className="rounded-lg shadow-md w-full aspect-[3/4] object-cover"
            />
          </div>
          <div className="md:w-2/3">
            <p className="text-lg mb-4">
              Explora diversas oportunidades para generar ingresos adicionales
              desde la comodidad de tu hogar, sin importar tu nivel de
              experiencia.
            </p>
            <ul className="space-y-2">
              <li className="flex">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                <div className="flex-1">
                  Descubre oportunidades de trabajo remoto
                </div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                <div className="flex-1">
                  Aprende sobre negocios online rentables
                </div>
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
            <p className="text-base text-gray-600 mb-1">
              Valor Total del Paquete:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 mb-3">
              <li>Software TrackMySpend: $57</li>
              <li>Pack de Funciones Premium: $147</li>
              <li>3 eBooks Financieros: $87</li>
            </ul>
            <p className="text-lg font-medium text-gray-700">
              Precio Regular: <span className="line-through">$291 USD</span>
            </p>
          </div>
          <p className="text-4xl font-bold text-green-600 mb-2">Hoy: $47 USD</p>
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
