"use client";
import React, { useEffect } from "react";

export type HowToUseProps = {};

export const HowToUse = ({}: HowToUseProps) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://scripts.converteai.net/769d0a20-d707-4621-8a28-39232bb67a07/players/679e8ea7a67e5439a43c901d/player.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

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
        id="vid_679e8ea7a67e5439a43c901d"
        style={{ position: "relative", width: "100%", paddingTop: "64.98%" }}
      >
        <img
          id="thumb_679e8ea7a67e5439a43c901d"
          src="https://images.converteai.net/769d0a20-d707-4621-8a28-39232bb67a07/players/679e8ea7a67e5439a43c901d/thumbnail.jpg"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
          alt="thumbnail"
        />
        <div
          id="backdrop_679e8ea7a67e5439a43c901d"
          style={{
            WebkitBackdropFilter: "blur(5px)",
            backdropFilter: "blur(5px)",
            position: "absolute",
            top: 0,
            height: "100%",
            width: "100%",
          }}
        ></div>
      </div>
      <p className="text-lg mt-6">
        Empieza a organizar tus finanzas hoy mismo y descubre cómo TrackMySpend
        puede ayudarte.
      </p>
    </section>
  );
};
