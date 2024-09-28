import { AvailableLanguages, getDictionary } from "@/src/translations";
import React from "react";

export type SupportPageProps = {
  params: { lang: AvailableLanguages };
};

export default async function SupportPage({
  params: { lang },
}: SupportPageProps) {
  const dict = await getDictionary(lang);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6">
        {/* Header Section */}
        <header className="text-center my-8">
          <h1 className="text-4xl font-bold text-gray-800">
            {dict.supportPage.title}
          </h1>
          <p className="text-gray-600 mt-4">{dict.supportPage.description}</p>
        </header>

        {/* FAQ Section */}
        <section className="my-12">
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
        </section>

        {/* Contact Section */}
        <section className="my-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {dict.supportPage.getInContact}
          </h2>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <p className="text-gray-600 mb-4">
              {dict.supportPage.getInContactDescription}
            </p>
            <ul className="list-disc list-inside">
              <li>
                <strong>{`${dict.shared.email}:`}</strong>{" "}
                <a
                  href="mailto:support@trackmyspend.co"
                  className="text-blue-500 hover:text-blue-600"
                >
                  support@trackmyspend.co
                </a>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
