import { AppDictionary } from "@/src/translations";
import React from "react";

export type SupportPageProps = {
  dict: AppDictionary;
};

export default async function FAQs({ dict }: SupportPageProps) {
  return (
    <div className="bg-gray-100">
      <div className="container mx-auto px-4 sm:px-0 py-16 sm:py-24">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {dict.faqs.title}
        </h2>
        <div className="bg-white shadow-lg rounded-lg p-6">
          {/* FAQ 1 */}
          {/* <div className="mb-4">
              <h3 className="text-xl font-medium text-gray-700">
                ¿Cómo puedo recuperar mi contraseña?
              </h3>
              <p className="text-gray-600 mt-2">
                Para recuperar tu contraseña, haz clic en el enlace "Olvidé mi
                contraseña" en la página de inicio de sesión y sigue las
                instrucciones que te enviamos por correo electrónico.
              </p>
            </div> */}
          {/* FAQ 2 */}
          <div className="mb-4">
            <h3 className="text-xl font-medium text-gray-700">
              {dict.faqs.question1}
            </h3>
            <p className="text-gray-600 mt-2">
              {`${dict.faqs.answer1} `}
              <a
                href="mailto:support@trackmyspend.co"
                className="text-blue-500 hover:text-blue-600"
              >
                support@trackmyspend.co
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
