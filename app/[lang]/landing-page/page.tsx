import { Container, Footer } from "@/src/ui/components";
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
import TestimonialSection from "@/src/ui/financial-app/home-page/initial-review";

export type MainPageProps = {
  params: { lang: AvailableLanguages };
  searchParams: {};
};

export default async function MainPage({
  params: { lang },
  searchParams,
}: MainPageProps) {
  const dict = await getDictionary(lang);

  const campaign = (searchParams as any)?.utm_campaign;
  const fbclid = (searchParams as any)?.fbclid;

  return (
    <>
      <main className="flex flex-col">
        <div className="sm:min-h-screen bg-neutral-800 pt-5 pb-10">
          <Container>
            <div className="flex justify-center mt-5">
              <AppLogo variant="small" />
            </div>
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
            <PricingOfferSection campaign={campaign} fbclid={fbclid} lang={lang} />
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
      </main>
      <Footer dict={dict} />
    </>
  );
}
