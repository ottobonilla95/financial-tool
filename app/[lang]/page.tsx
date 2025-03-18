import { Container, Footer, Header } from "@/src/ui/components";
import { AvailableLanguages, getDictionary } from "@/src/translations";
import {
  Testimonials,
  Intro,
  HowToUse,
  PricingOfferSection,
  GuaranteeSection,
  YourRelationWithMoneyWillChange,
  AIAssistant,
  PainPoints,
} from "@/src/ui/financial-app/home-page";
import FAQs from "@/src/ui/faqs/faqs";
import { OfferType } from "@/src/types";
import TestimonialSection from "@/src/ui/financial-app/home-page/initial-review";

export type MainPageProps = {
  params: { lang: AvailableLanguages };
  searchParams: { offer: OfferType; utm_campaign: string };
};

export default async function MainPage({
  params: { lang },
  searchParams: { offer, utm_campaign },
}: MainPageProps) {
  const dict = await getDictionary(lang);
  const campaign = utm_campaign;

  return (
    <>
      <main className="flex flex-col">
        <Header lang={lang} dict={dict} />
        <div className="sm:min-h-screen bg-neutral-800 pt-5 pb-10">
          <Container>
            <div className="h-5" />
            <Intro dict={dict} lang={lang} />
          </Container>
        </div>
        <div className="bg-neutral-800 pb-20 text-neutral-300 text-center">
          <Container>
            <TestimonialSection dict={dict} />
          </Container>
        </div>

        <div className="bg-neutral-900">
          <Container variant="narrow">
            <div className="text-[70px] text-center -mt-12">❌</div>
            <div className="pt-2">
              <PainPoints lang={lang} dict={dict} />
            </div>
          </Container>
        </div>

        <div>
          <Container variant="narrow">
            <div className="pt-2 pb-10">
              <div className="text-[80px] text-center ">🔥</div>
              <YourRelationWithMoneyWillChange lang={lang} />
            </div>
          </Container>
        </div>

        <div className="bg-neutral-100">
          <Container variant="narrow">
            <AIAssistant lang={lang} />
          </Container>
        </div>

        <div className="bg-neutral-100 pt-8 pb-10">
          <Container variant="narrow">
            <HowToUse lang={lang} />
          </Container>
        </div>
        <div className="bg-neutral-900 pt-14 pb-8">
          <Container variant="narrow">
            <Testimonials dict={dict} />
          </Container>
        </div>

        <div className="bg-neutral-900 pt-14 pb-8" id="offer">
          <Container variant="standard">
            <PricingOfferSection campaign={campaign} lang={lang} />
          </Container>
        </div>

        <div className="bg-neutral-100 pt-14 pb-8">
          <Container variant="narrow">
            <GuaranteeSection lang={lang} />
          </Container>
        </div>

        <div className="bg-neutral-900 pt-14 pb-8">
          <Container variant="narrow">
            <FAQs dict={dict} />
          </Container>
        </div>
        {/* <div className="min-h-screen">
          <div />
          <Header lang={lang} dict={dict} />
          <Container>
            <div className="mt-4 sm:mt-10 flex grow gap-6 xl:gap-0 flex-col lg:flex-row">
              <div className="w-full">
                <div className="flex flex-col justify-center gap-6 text-neutral-100 lg:max-w-[700px]">
                  <h1 className="font-extrabold  text-center sm:text-left text-3xl lg:text-5xl tracking-tight md:-mb-4 flex flex-col gap-3 items-center sm:items-start">
                    <span className="relative">
                      {dict.mainPage.introMessage1}

                      {` ${dict.mainPage.introMessage2}`}

                      <span className="relative whitespace-nowrap mr-4 ml-3">
                        <span className="absolute bg-gray-100 -left-2 -top-1 -bottom-1 -right-2 md:-left-3 md:-top-0 md:-bottom-0 md:-right-3 -rotate-1"></span>
                        <span className="relative text-neutral-900">
                          {dict.mainPage.introMessage3}
                        </span>
                      </span>
                      <span>{dict.mainPage.introMessage4}</span>
                    </span>
                  </h1>

                  <p className="text-base opacity-80 leading-relaxed sm:text-lg sm:mt-4 text-center sm:text-left">
                    {dict.mainPage.welcomeDescription}
                  </p>

                  <div className="xl:flex">
                    <div className="flex items-center flex-col">
                      <StartForm dict={dict} lang={lang} offer={offer} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src={`/images/home-page/${lang}/hero-desktop.png`}
                  width={1000}
                  height={760}
                  alt="Screenshots of the dashboard project showing desktop version"
                />
              </div>
            </div>

            <section className="flex flex-wrap items-center justify-center text-neutral-100 mt-6 mb-12 xl:py-5">
              <span className="text-xs opacity-50 mr-2">Featured on</span>
              <a
                href="https://x.com/ottobonilla95/status/1843986969715691806"
                target="_blank"
                rel="noreferrer"
                title="Featured on X.com"
              >
                <XIcon className="w-8 md:w-9" />
              </a>
            </section>
          </Container>
        </div> */}

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

        {/* <Container variant="narrow">
          <WhatWillYouGet dict={dict} />
        </Container> */}
      </main>
      <Footer dict={dict} />
    </>
  );
}
