import { AvailableLanguages, getDictionary } from "@/src/translations";

export type AccountPageProps = {
  params: { lang: AvailableLanguages };
};

export default async function TutorialPage({
  params: { lang },
}: AccountPageProps) {
  const dict = await getDictionary(lang);

  return (
    <div className="p-2 md:p-5">
      <div className="rounded-sm shadow-sm bg-white p-5">
        <h1 className="text-2xl font-bold mb-4 ">
          {dict.videoTutorialPage.mainHeading}
        </h1>

        <h2 className="text-xl font-semibold mb-3 ">
          {dict.videoTutorialPage.title}
        </h2>
        <p className=" mb-4">{dict.videoTutorialPage.description}</p>
        <div className="h-10" />
        <div
          className="relative sm:max-w-[700px] mx-auto"
          style={{ paddingTop: "36.25%" }}
        >
          <iframe
            src="https://player.vimeo.com/video/1053443885?h=b537575afe&badge=0&autopause=0&player_id=0&app_id=58479"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
            className="absolute top-0 left-0 w-full h-full"
            title="final"
          ></iframe>
        </div>
        <div className="h-10" />
      </div>
    </div>
  );
}
