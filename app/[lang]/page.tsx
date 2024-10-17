import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import { Footer, Header } from "@/src/ui/components";
import { AvailableLanguages, getDictionary } from "@/src/translations";
import {
  KeyFeatures,
  HowItWorks,
  Testimonials,
  AppScreenshots,
  Pricing,
} from "@/src/ui/financial-app/home-page";
import FAQs from "@/src/ui/faqs/faqs";
import { LanguagePicker } from "@/src/ui/language-picker";

export type MainPageProps = {
  params: { lang: AvailableLanguages };
};

export default async function MainPage({ params: { lang } }: MainPageProps) {
  const dict = await getDictionary(lang);

  return (
    <>
      <main className="flex min-h-screen flex-col">
        <Header lang={lang} dict={dict} />

        <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
          <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
            <p
              className={`text-xl text-gray-800 md:text-3xl md:leading-normal`}
            >
              <strong>{`${dict.mainPage.welcome} `}</strong>
              {dict.mainPage.welcomeDescription}
            </p>
            <Link
              href="/login"
              className="flex items-center gap-5 self-start rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:opacity-70 md:text-base"
            >
              <span>{dict.authPages.login}</span>
              <ArrowRightIcon className="w-5 md:w-6" />
            </Link>
            <Link
              href="/pricing"
              className="flex items-center gap-5 self-start rounded-lg px-6 py-3 text-sm font-medium transition-colors hover:opacity-70 md:text-base"
            >
              <span>{dict.authPages.createAccount}</span>
              <ArrowRightIcon className="w-5 md:w-6" />
            </Link>
          </div>
          <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
            <Image
              src={`/images/home-page/${lang}/hero-desktop.png`}
              width={1000}
              height={760}
              className="hidden md:block"
              alt="Screenshots of the dashboard project showing desktop version"
            />
            <Image
              src={`/images/home-page/${lang}/hero-mobile.png`}
              width={560}
              height={620}
              className="block md:hidden"
              alt="Screenshot of the dashboard project showing mobile version"
            />
          </div>
        </div>
        <KeyFeatures dict={dict} />
        <HowItWorks dict={dict} />
        <AppScreenshots dict={dict} />
        <Testimonials dict={dict} />
        <div className="py-10">
          <h2 className="text-4xl font-bold mb-10 text-center">
            {dict.shared.pricing}
          </h2>
          <Pricing dict={dict} lang={lang} />
        </div>
        <FAQs dict={dict} />
      </main>
      <Footer dict={dict} />
    </>
  );
}
