import React from "react";

export const HowToUseEs = () => {
  return (
    <section id="how-to-use" className="tracking-tight">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Cómo Usar TrackMySpend
      </h2>
      <p className="text-lg mb-6">
        Descubre lo fácil que es tomar el control de tus finanzas con
        TrackMySpend. Mira este video para ver cómo funciona.
      </p>
      <div
        className="relative sm:max-w-[700px] mx-auto"
        style={{ paddingTop: "70.25%" }}
      >
        <iframe
          src="https://player.vimeo.com/video/1053443885?h=b537575afe&badge=0&autopause=0&player_id=0&app_id=58479"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
          className="absolute top-0 left-0 w-full h-full"
          title="final"
        ></iframe>
      </div>
      <p className="text-lg mt-6">
        Empieza a organizar tus finanzas hoy mismo y descubre cómo TrackMySpend
        puede ayudarte.
      </p>
    </section>
  );
};
