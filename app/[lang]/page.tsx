import { BanknotesIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Image from "next/image";
import { Container, Footer, Header } from "@/src/ui/components";
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
          <Header lang={lang} dict={dict} />
          <Container>
            <div className="mt-4 sm:mt-10 flex grow flex-col xl:flex-row">
              <div className="flex flex-col justify-center gap-6 text-neutral-100">
                <h1 className="font-extrabold  text-center sm:text-left text-4xl lg:text-6xl tracking-tight md:-mb-4 flex flex-col gap-3 items-center sm:items-start">
                  <span className="relative">
                    Take control of your
                    <span className="inline md:hidden">spending, </span>
                  </span>
                  <span className="whitespace-nowrap relative">
                    <span className="mr-3 sm:mr-4 md:mr-5 hidden sm:inline">
                      spending,
                    </span>
                    <span className="relative whitespace-nowrap">
                      <span className="absolute bg-gray-100 -left-2 -top-1 -bottom-1 -right-2 md:-left-3 md:-top-0 md:-bottom-0 md:-right-3 -rotate-1"></span>
                      <span className="relative text-neutral-900">
                        effortlessly
                      </span>
                    </span>
                  </span>
                </h1>
                {/* <strong>{`${dict.mainPage.welcome} `}</strong>
                {dict.mainPage.welcomeDescription} */}
                <p className="text-lg opacity-80 leading-relaxed mt-4 sm:mt-8 text-center sm:text-left">
                  Track, manage, and analyze your expenses in one simple tool.
                  Make informed decisions about your money and feel empowered
                  every step of the way.
                </p>
                <div className="flex mt-4 sm:mt-8 mb-4 justify-center sm:justify-start">
                  <Link
                    href="/pricing"
                    className="tracking-tight group border-0 gap-2 text-black flex px-4 py-2 rounded-md bg-lime-500 font-medium"
                  >
                    <BanknotesIcon className="w-6 h-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-200 ease-in-out" />
                    Take Control Today
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

            <section className="flex flex-wrap items-center justify-center text-neutral-100 mt-3 mb-10 xl:mt-32 xl:mb-0">
              <span className="text-xs opacity-50">Featured on</span>
              <a
                href="https://x.com/ottobonilla95/status/1843986969715691806"
                target="_blank"
                rel="noreferrer"
                title="Featured on X.com"
              >
                <svg
                  className="w-8 md:w-9 fill-base-content saturate-0 contrast-50 opacity-80 hover:opacity-100 hover:saturate-100 hover:contrast-100 duration-100 cursor-pointer"
                  viewBox="0 0 252 252"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_177_29)">
                    <path
                      d="M126 250.793C195.036 250.793 251 194.875 251 125.897C251 56.9181 195.036 1 126 1C56.9644 1 1 56.9181 1 125.897C1 194.875 56.9644 250.793 126 250.793Z"
                      fill="black"
                      stroke="white"
                      stroke-miterlimit="10"
                    ></path>
                    <path
                      d="M48.9999 53.5352L108.748 133.357L48.6233 198.256H62.1561L114.797 141.435L157.327 198.256H203.377L140.265 113.945L196.23 53.5352H182.697L134.219 105.865L95.0494 53.5352H48.9999ZM68.9004 63.4941H90.0554L183.474 188.297H162.319L68.9004 63.4941Z"
                      fill="white"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_177_29">
                      <rect width="252" height="252" fill="white"></rect>
                    </clipPath>
                  </defs>
                </svg>
              </a>
            </section>
          </Container>
        </div>

        <Container>
          <KeyFeatures dict={dict} />
          <HowItWorks dict={dict} />
          <AppScreenshots dict={dict} />
          <Testimonials dict={dict} />
          <div className="py-10 text-neutral-100 tracking-tight">
            <h2 className="text-5xl font-bold mb-10 text-center">
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
