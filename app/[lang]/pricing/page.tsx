import { AvailableLanguages, getDictionary } from "@/src/translations";
import { Button, Container, Footer, Header } from "@/src/ui/components";
import {
  Pricing,
  Testimonials,
  WhatWillYouGet,
} from "@/src/ui/financial-app/home-page";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { lang: AvailableLanguages };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);

  return {
    title: dict.aboutUsPage.meta.title,
    description: dict.aboutUsPage.meta.description,
  };
}

export type AboutUsPageProps = {
  params: { lang: AvailableLanguages };
  searchParams: { email: string };
};
export default async function AboutUsPage({
  params: { lang },
  searchParams: { email },
}: AboutUsPageProps) {
  const dict = await getDictionary(lang);

  return (
    <>
      <main className="flex min-h-screen flex-col bg-neutral-800 text-neutral-100 px-4 sm:px-0">
        <Header dict={dict} lang={lang} />

        <Container variant="narrow">
          <h1 className="font-extrabold text-3xl lg:text-4xl md:-mb-4 flex flex-col gap-3 text-center mt-10">
            <span className="relative ">{dict.pricingPage.title1}</span>
            {/* <span className="whitespace-nowrap relative text-center">
              <span className="relative whitespace-nowrap">
                <span className="absolute bg-gray-100 -left-2 -top-1 -bottom-1 -right-2 md:-left-3 md:-top-0 md:-bottom-0 md:-right-3 -rotate-1"></span>
                <span className="relative text-neutral-900">
                  {dict.pricingPage.title2}
                </span>
              </span>
            </span>
            <span className="ml-4 sm:mr-4 md:mr-5">
              {dict.pricingPage.title3}
            </span> */}
          </h1>
          <div className="flex justify-center">
            <p className="text-center mt-5 sm:max-w-2xl text-lg mb-5">
              {dict.pricingPage.heroText}
            </p>
          </div>
          <Button
            className="mt-4 !text-base group rounded-lg bg-lime-500 font-medium text-black hover:opacity-70 focus-visible:outline-black active:opacity-80 border-0 min-w-[300px] !font-bold"
            iconPosition="left"
            href="#pricing"
          >
            {dict.mainPage.takeControlToday}
          </Button>
        </Container>
        <Container variant="full">
          <Testimonials dict={dict} />
        </Container>
        <Container variant="narrow">
          {/* Introduction Section */}

          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
            <span> {dict.mainPage.introduction.title1}</span>{" "}
            <span className="relative">
              {dict.mainPage.introduction.title2}
              <span className="absolute left-0 bottom-0 w-full h-1 bg-lime-400 rounded-full"></span>
            </span>{" "}
            <span> {dict.mainPage.introduction.title3}</span>
          </h2>
          <div className="flex justify-center">
            <div className="max-w-[500px]">
              <img
                src="https://res.cloudinary.com/dav4ntxrq/image/upload/v1736017674/app%20images/arn7wrrvxxiuixzgm2md.png"
                className="w-full"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <div className="mt-12 text-lg sm:text-2xl flex flex-col gap-4">
              {dict.mainPage.introduction.sections.map((section, index) => (
                <div key={index}>
                  {section.subtitle && (
                    <h3 className="text-lg sm:text-2xl font-bold mt-5">
                      {section.subtitle}
                    </h3>
                  )}
                  <div className="mt-4 flex flex-col gap-4">
                    {section.content.map((paragraph, i) => (
                      <div key={i}>{paragraph}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Button
            className="mt-10 !text-base group rounded-lg bg-lime-500 font-medium text-black hover:opacity-70 focus-visible:outline-black active:opacity-80 border-0 min-w-[300px] !font-bold"
            iconPosition="left"
            href="#pricing"
          >
            {dict.mainPage.takeControlToday}
          </Button>
          {/* WhatWillYouGet Component */}
          <div className="mt-10" />
          <WhatWillYouGet dict={dict} />

          {/* Pricing Section */}
          <div id="pricing" />
          <h2 className="text-4xl font-bold pb-8 sm:pb-12 text-center pt-4 xl:pt-8">
            {dict.pricingPage.chooseYourPlan}
          </h2>
          <Pricing dict={dict} lang={lang} email={email} />

          <div className="h-10" />
        </Container>
      </main>

      <Footer dict={dict} />
    </>
  );
}
