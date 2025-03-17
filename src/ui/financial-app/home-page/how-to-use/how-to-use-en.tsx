import React from "react";

export const HowToUseEn = () => {
  return (
    <section id="how-to-use" className="tracking-tight">
      <h2 className="text-3xl font-bold mb-6 text-center">
        How to Use TrackMySpend
      </h2>
      <p className="text-lg mb-6">
        Discover how easy it is to take control of your finances with
        TrackMySpend. Watch this video to see how it works.
      </p>
      <div
        className="relative sm:max-w-[700px] mx-auto"
        style={{ paddingTop: "70.25%" }}
      >
        <iframe
          src="https://player.vimeo.com/video/1066428143?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
          className="absolute top-0 left-0 w-full h-full"
          title="How to use"
        ></iframe>
      </div>
      <p className="text-lg mt-6">
        Start organizing your finances today and see how TrackMySpend can help
        you.
      </p>
    </section>
  );
};
