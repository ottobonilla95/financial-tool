import { Container, Footer, QuoteIcon } from "@/src/ui/components";
import { AvailableLanguages, getDictionary } from "@/src/translations";
import {
  Testimonials,
  PainPoints,
  YourRelationWithMoneyWillChange,
  AIAssistant,
  HowToUse,
  GuaranteeSection,
  PricingOfferSection,
  Intro,
} from "@/src/ui/financial-app/home-page";
import FAQs from "@/src/ui/faqs/faqs";
import AppLogo from "@/src/ui/app-logo";

export type MainPageProps = {
  params: { lang: AvailableLanguages };
};

export default async function MainPage({ params: { lang } }: MainPageProps) {
  const dict = await getDictionary(lang);

  return (
    <>
      <main className="flex flex-col">
        {/* <div className="bg-neutral-900 h-5" /> */}

        <div className="sm:min-h-screen bg-neutral-800 pt-5 pb-20">
          <Container>
            <div className="flex justify-center mt-5">
              <AppLogo variant="small" />
            </div>
            <div className="h-5" />
            <Intro dict={dict} />
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

              <YourRelationWithMoneyWillChange />
            </div>
          </Container>
        </div>

        <div className="bg-neutral-100">
          <Container variant="narrow">
            <AIAssistant />
          </Container>
        </div>

        <div className="bg-neutral-100 pt-8 pb-10">
          <Container variant="narrow">
            <HowToUse />
          </Container>
        </div>
        <div className="bg-neutral-900 pt-14 pb-8">
          <Container variant="narrow">
            <Testimonials dict={dict} />
          </Container>
        </div>

        <div className="bg-neutral-900 pt-14 pb-8" id="offer">
          <Container variant="standard">
            <PricingOfferSection />
          </Container>
        </div>

        <div className="bg-neutral-100 pt-14 pb-8">
          <Container variant="narrow">
            <GuaranteeSection />
          </Container>
        </div>

        <div className="bg-neutral-900 pt-14 pb-8">
          <Container variant="narrow">
            <FAQs dict={dict} />
          </Container>
        </div>
      </main>
      <Footer dict={dict} />
    </>
  );
}
