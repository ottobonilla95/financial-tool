import { BanknotesIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Image from "next/image";
import { Container, Footer, Header, XIcon } from "@/src/ui/components";
import { AvailableLanguages, getDictionary } from "@/src/translations";
import {
  KeyFeatures,
  HowItWorks,
  Testimonials,
  AppScreenshots,
  Pricing,
} from "@/src/ui/financial-app/home-page";
import FAQs from "@/src/ui/faqs/faqs";

export type MainPageProps = {
  params: { lang: AvailableLanguages };
};

export default async function MainPage({ params: { lang } }: MainPageProps) {
  const dict = await getDictionary(lang);

  return (
    <>
      <main className="flex flex-col bg-neutral-800">
        <div className="min-h-screen">
          <div />
          <Header lang={lang} dict={dict} />
          <Container>
            <div className="mt-4 sm:mt-10 flex grow gap-6 xl:gap-0 flex-col xl:flex-row">
              <div className="flex flex-col justify-center gap-6 text-neutral-100">
                <h1 className="font-extrabold  text-center sm:text-left text-4xl lg:text-6xl tracking-tight md:-mb-4 flex flex-col gap-3 items-center sm:items-start">
                  <span className="relative">
                    {dict.mainPage.introMessage1}
                    <span className="inline md:hidden">
                      {` ${dict.mainPage.introMessage2}`}
                    </span>
                  </span>
                  <span className="whitespace-nowrap relative">
                    <span className="mr-3 sm:mr-4 md:mr-5 hidden md:inline">
                      {dict.mainPage.introMessage2}
                    </span>
                    <span className="relative whitespace-nowrap">
                      <span className="absolute bg-gray-100 -left-2 -top-1 -bottom-1 -right-2 md:-left-3 md:-top-0 md:-bottom-0 md:-right-3 -rotate-1"></span>
                      <span className="relative text-neutral-900">
                        {dict.mainPage.introMessage3}
                      </span>
                    </span>
                  </span>
                </h1>

                <p className="text-lg opacity-80 leading-relaxed mt-4 sm:mt-8 text-center sm:text-left">
                  {dict.mainPage.welcomeDescription}
                </p>
                <div className="flex mt-4 sm:mt-8 mb-4 justify-center sm:justify-start">
                  <Link
                    href="/pricing"
                    className="tracking-tight group border-0 gap-2 text-black flex px-5 py-2 rounded-md bg-lime-500 font-medium"
                  >
                    <BanknotesIcon className="w-6 h-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-200 ease-in-out" />
                    {dict.mainPage.takeControlToday}
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src={`/images/home-page/${lang}/hero-desktop.png`}
                  width={1000}
                  height={760}
                  className="hidden xl:block"
                  alt="Screenshots of the dashboard project showing desktop version"
                />
                <Image
                  src={`/images/home-page/${lang}/hero-mobile.png`}
                  width={400}
                  height={620}
                  className="block xl:hidden"
                  alt="Screenshot of the dashboard project showing mobile version"
                />
              </div>
            </div>

            <section className="flex flex-wrap items-center justify-center text-neutral-100 mt-6 mb-12 xl:py-5">
              <span className="text-xs opacity-50">Featured on</span>
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
        </div>

        <Container>
          <KeyFeatures dict={dict} />
          <HowItWorks dict={dict} />
          <AppScreenshots dict={dict} lang={lang} />
          <Testimonials dict={dict} />
          <div className="py-10 text-neutral-100 tracking-tight">
            <h2 className="text-5xl font-bold sm:mb-10 xl:mb-12 text-center">
              {dict.shared.pricing}
            </h2>
            <Pricing dict={dict} lang={lang} />
          </div>
          <FAQs dict={dict} />
        </Container>
      </main>
      <Footer dict={dict} />
    </>
  );
}
