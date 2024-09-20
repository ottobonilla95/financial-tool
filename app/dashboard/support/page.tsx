import React from "react";

export default async function Page() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6">
        {/* Header Section */}
        <header className="text-center my-8">
          <h1 className="text-4xl font-bold text-gray-800">Soporte</h1>
          <p className="text-gray-600 mt-4">
            Encuentra respuestas a tus preguntas o ponte en contacto con nuestro
            equipo de soporte.
          </p>
        </header>

        {/* FAQ Section */}
        <section className="my-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Preguntas Frecuentes (FAQ)
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
                ¿Cómo puedo contactar al soporte técnico?
              </h3>
              <p className="text-gray-600 mt-2">
                Puedes contactar a nuestro equipo de soporte enviándonos un
                correo a
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
            Ponte en Contacto
          </h2>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <p className="text-gray-600 mb-4">
              Si no encontraste la respuesta a tu pregunta en nuestras FAQ,
              puedes ponerte en contacto con nosotros a través de cualquiera de
              los siguientes métodos:
            </p>
            <ul className="list-disc list-inside">
              <li>
                <strong>Email:</strong>{" "}
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
