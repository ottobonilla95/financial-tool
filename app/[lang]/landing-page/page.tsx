import Image from "next/image";
import { Button, Container, Footer, Header, XIcon } from "@/src/ui/components";
import { AvailableLanguages, getDictionary } from "@/src/translations";
import {
  KeyFeatures,
  HowItWorks,
  Testimonials,
  AppScreenshots,
  MyStory,
  VisualBenefit,
  PainPoints,
  Benefits,
  StartForm,
  WhatWillYouGet,
  YourRelationWithMoneyWillChange,
  AIAssistant,
} from "@/src/ui/financial-app/home-page";
import FAQs from "@/src/ui/faqs/faqs";
import { OfferType } from "@/src/types";
import { FireIcon } from "@heroicons/react/24/solid";

export type MainPageProps = {
  params: { lang: AvailableLanguages };
  searchParams: { offer: OfferType };
};

export default async function MainPage({
  params: { lang },
  searchParams: { offer },
}: MainPageProps) {
  const dict = await getDictionary(lang);

  return (
    <>
      <main className="flex flex-col">
        <div className="bg-neutral-900 h-5" />
        <div className="sm:min-h-screen bg-neutral-100 pt-5 pb-20">
          <Container>
            <div className="mt-4 sm:mt-10 mb-2 sm:mb-10">
              <div className="w-full flex justify-center">
                <div className="text-center lg:max-w-[800px] flex flex-col gap-6 mb-6">
                  <h1 className="font-extrabold text-center text-3xl lg:text-6xl tracking-tight md:-mb-4 flex flex-col gap-3 items-center sm:items-start">
                    <span className="relative">
                      {dict.mainPage.introMessage1}

                      {` ${dict.mainPage.introMessage2}`}

                      <span className="relative whitespace-nowrap mr-4 ml-3">
                        <span className="absolute bg-neutral-900 -left-2 -top-1 -bottom-1 -right-2 md:-left-3 md:-top-0 md:-bottom-0 md:-right-3 -rotate-1"></span>
                        <span className="relative text-white">
                          {dict.mainPage.introMessage3}
                        </span>
                      </span>
                      <span>{dict.mainPage.introMessage4}</span>
                    </span>
                  </h1>

                  <p className="text-base opacity-80 leading-relaxed sm:text-xl sm:mt-4 text-center">
                    {dict.mainPage.welcomeDescription}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src={`/images/home-page/${lang}/hero-desktop.png`}
                  className="w-[100%] sm:w-[700px]"
                  // className="hidden lg:block"
                  alt="Screenshots of the dashboard project showing desktop version"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <div className="sm:max-w-[400px]">
                <Button
                  className="!font-bold mt-4 !text-xl group rounded-lg bg-lime-500 font-medium text-black hover:opacity-70 focus-visible:outline-black active:opacity-80 border-0 min-w-[300px] !py-8"
                  icon={
                    <FireIcon className="w-6 h-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-200 ease-in-out" />
                  }
                  iconPosition="left"
                >
                  {dict.mainPage.takeControlToday}
                </Button>
              </div>
            </div>

            {/* <section className="flex flex-wrap items-center justify-center mt-6 mb-12 xl:py-5">
              <span className="text-xs opacity-50 mr-2">Featured on</span>
              <a
                href="https://x.com/ottobonilla95/status/1843986969715691806"
                target="_blank"
                rel="noreferrer"
                title="Featured on X.com"
              >
                <XIcon className="w-8 md:w-9" />
              </a>
            </section> */}
          </Container>
        </div>

        {/* <Container> */}
        {/* {lang === "es" && (
            <div className="hidden sm:block">
              <div className="flex items-center justify-center">
                <div className="w-full max-w-3xl aspect-video">
                  <iframe
                    className="w-full h-full rounded-lg"
                    src="https://www.youtube.com/embed/pF_FUhNY--E?autoplay=1&mute=1"
                    title="YouTube video"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
              <div className="mt-12">
                <div className="flex items-center flex-col">
                  <div>
                    <img
                      src="https://res.cloudinary.com/dav4ntxrq/image/upload/v1731070991/app%20images/arrows/yluhzruf6wmgukjzzuin.png"
                      className="w-[120px] sm:w-[180px]"
                    />
                  </div>

                  <StartForm dict={dict} lang={lang} offer={offer} />

                  <div>
                    <img
                      src="https://res.cloudinary.com/dav4ntxrq/image/upload/v1731070991/app%20images/arrows/yluhzruf6wmgukjzzuin.png"
                      className="w-[120px] sm:w-[180px] rotate-180 mb-12"
                    />
                  </div>
                </div>
              </div>
            </div>
          )} */}

        {/* <VisualBenefit dict={dict} /> */}
        {/* </Container> */}

        {/* <PainPoints dict={dict} /> */}

        <div className="bg-neutral-900">
          <Container variant="narrow">
            <div className="text-[80px] text-center -mt-16">🛑</div>
            {/* <div className="text-[80px] text-center -mt-16">🔥</div> */}

            <div className="pt-2">
              {/* <WhatWillYouGet dict={dict} /> */}
              <PainPoints lang={lang} dict={dict} />
            </div>
          </Container>
        </div>

        <div>
          <Container variant="narrow">
            <div className="pt-2">
              <div className="text-[80px] text-center ">🔥</div>

              <YourRelationWithMoneyWillChange dict={dict} lang={lang} />
            </div>
          </Container>
        </div>

        <div className="bg-neutral-100">
          <Container variant="narrow">
            <div className="pt-2">
              <div className="text-[80px] text-center ">🤖</div>

              <AIAssistant dict={dict} lang={lang} />
            </div>
          </Container>
        </div>
        <Container>
          {/* <Benefits dict={dict} /> */}
          {/* <KeyFeatures dict={dict} /> */}

          <HowItWorks dict={dict} />
          <Testimonials dict={dict} />

          <AppScreenshots dict={dict} lang={lang} />
          <div className="mt-12">
            <div className="flex items-center flex-col">
              <div>
                <img
                  src="https://res.cloudinary.com/dav4ntxrq/image/upload/v1731070991/app%20images/arrows/yluhzruf6wmgukjzzuin.png"
                  className="w-[120px] sm:w-[180px]"
                />
              </div>

              <div className="flex mt-4 sm:mt-8 mb-4 justify-center sm:justify-start w-full sm:w-auto">
                <StartForm dict={dict} lang={lang} offer={offer} />
              </div>
              <div>
                <img
                  src="https://res.cloudinary.com/dav4ntxrq/image/upload/v1731070991/app%20images/arrows/yluhzruf6wmgukjzzuin.png"
                  className="w-[120px] sm:w-[180px] rotate-180"
                />
              </div>
            </div>
          </div>

          {/* <div className="py-10 text-neutral-100 tracking-tight">
            <h2 className="text-5xl font-bold sm:mb-10 xl:mb-12 text-center">
              {dict.shared.pricing}
            </h2>
            <Pricing dict={dict} lang={lang} />
          </div> */}
          <FAQs dict={dict} />
        </Container>
      </main>
      <Footer dict={dict} />
    </>
  );
}
