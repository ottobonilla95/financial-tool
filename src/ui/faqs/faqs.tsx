import { AppDictionary } from "@/src/translations";
import React from "react";

export type SupportPageProps = {
  dict: AppDictionary;
};

export default async function FAQs({ dict }: SupportPageProps) {
  return (
    <div className="text-neutral-100 tracking-tight">
      <div className="py-16 sm:py-24">
        <h2 className="text-3xl sm:text-5xl font-semibold mb-6">
          {dict.faqs.title}
        </h2>
        <div className="">
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
            <h3 className="text-xl font-medium ">{dict.faqs.question1}</h3>
            <div className="mt-2 text-lg opacity-80">
              {`${dict.faqs.answer1} `}
            </div>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-medium ">{dict.faqs.question2}</h3>
            <div className="mt-2 text-lg opacity-80">
              {`${dict.faqs.answer2} `}
            </div>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-medium ">{dict.faqs.question3}</h3>
            <div className="mt-2 text-lg opacity-80">
              {`${dict.faqs.answer3} `}
            </div>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-medium ">{dict.faqs.question4}</h3>
            <div className="mt-2 text-lg opacity-80">
              {`${dict.faqs.answer4} `}
              <a
                href="mailto:support@trackmyspend.co"
                className="text-blue-500 hover:text-blue-600"
              >
                support@trackmyspend.co
              </a>
              .
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
