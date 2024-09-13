import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Sobre Nosotros</h3>
            <p className="text-gray-400">
              Ofrecemos los mejores servicios para ayudarte a gestionar tus
              finanzas y hacer crecer tu patrimonio. Conoce más sobre nuestra
              misión y visión.
            </p>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Enlaces Rápidos</h3>
            <ul>
              <li className="mb-2">
                <a href="/services" className="text-gray-400 hover:text-white">
                  Servicios
                </a>
              </li>
              <li className="mb-2">
                <a href="/about" className="text-gray-400 hover:text-white">
                  Sobre Nosotros
                </a>
              </li>
              <li className="mb-2">
                <a href="/contact" className="text-gray-400 hover:text-white">
                  Contacto
                </a>
              </li>
              <li className="mb-2">
                <a href="/privacy" className="text-gray-400 hover:text-white">
                  Política de Privacidad
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Copyright Section */}
        <div className="text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} TrackMySpend. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
