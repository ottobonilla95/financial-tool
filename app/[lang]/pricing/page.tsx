import { getPricingOptions } from "@/src/data/pricing_option";
import { getDBUser, updateDBUser } from "@/src/data/user";
import { getRandomPricingGroup } from "@/src/helpers/get-random-pricing-group";
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
  searchParams: { email: string; offer: string };
};
export default async function AboutUsPage({
  params: { lang },
  searchParams: { email, offer },
}: AboutUsPageProps) {
  const dict = await getDictionary(lang);

  const randomPricingGroup = getRandomPricingGroup();

  const pricingOptions = await getPricingOptions({
    filters: {
      pricing_group: offer || randomPricingGroup,
    },
  });

  await updateDBUser({
    filters: {
      email: email,
    },
    data: {
      pricing_group: randomPricingGroup,
    },
  });

  return (
    <>
      <main className="flex min-h-screen flex-col bg-neutral-800 text-neutral-100 px-4 sm:px-0">
        <Header dict={dict} lang={lang} />

        <Container variant="narrow">
          <h1 className="font-extrabold text-3xl lg:text-5xl md:-mb-4 flex flex-col gap-3 text-center mt-10">
            {/* <span className="relative ">{dict.pricingPage.title1}</span> */}
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
          <div className="flex justify-center mt-5 text-lg mb-2">
            <div className="sm:max-w-2xl ">
              {/* <p className="text-center mb-5">{dict.pricingPage.heroText}</p> */}

              <div className="flex justify-center">
                <img
                  src="https://res.cloudinary.com/dav4ntxrq/image/upload/v1736020666/app%20images/hc7mghgyj3llbpn3830m.png"
                  className="w-[80px]"
                />
              </div>
              <p className="mt-2 text-center text-base">
                {dict.pricingPage.warrenBuffetQuote}
              </p>

              <p className="italic text-lime-500 text-center">
                - Warren buffet
              </p>
            </div>
          </div>
          <div className="h-10" />
          {/* <div className="flex justify-center">
            <Button
              className="mt-4 max-w-[80px] !text-base group rounded-lg bg-lime-500 font-medium text-black hover:opacity-70 focus-visible:outline-black active:opacity-80 border-0 min-w-[300px] !font-bold"
              iconPosition="left"
              href="#pricing"
            >
              {dict.mainPage.takeControlToday}
            </Button>
          </div> */}
        </Container>
        {/* 
        <Container variant="full">
          <Testimonials dict={dict} />
        </Container> */}

        <Container className="mb-20 sm:mb-20">
          <h2 className="text-3xl font-bold sm:pb-12 text-center pt-4 xl:pt-8">
            {dict.pricingPage.chooseYourPlan}
          </h2>

          <Pricing
            dict={dict}
            lang={lang}
            email={email}
            offer={offer as any}
            pricingOptions={pricingOptions}
          />
        </Container>
        {/* <Container variant="narrow"> */}
          {/* Introduction Section */}

          {/* <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
            <span> {dict.mainPage.introduction.title1}</span>{" "}
            <span className="relative">
              {dict.mainPage.introduction.title2}
              <span className="absolute left-0 bottom-0 w-full h-1 bg-lime-400 rounded-full"></span>
            </span>{" "}
            <span> {dict.mainPage.introduction.title3}</span>
          </h2> */}
          {/* <div className="flex justify-center">
            <div className="max-w-[500px]">
              <img
                src="https://res.cloudinary.com/dav4ntxrq/image/upload/v1736017674/app%20images/arn7wrrvxxiuixzgm2md.png"
                className="w-full"
              />
            </div>
          </div> */}
          {/* 
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
          </div> */}
          {/* <div className="flex justify-center mt-10 mb-20">
            <Button
              className="mt-4 max-w-[80px] !text-base group rounded-lg bg-lime-500 font-medium text-black hover:opacity-70 focus-visible:outline-black active:opacity-80 border-0 min-w-[300px] !font-bold"
              iconPosition="left"
              href="#pricing"
            >
              {dict.mainPage.takeControlToday}
            </Button>
          </div> */}
          {/* WhatWillYouGet Component */}
          {/* <div className="mt-10" /> */}
          {/* <WhatWillYouGet dict={dict} /> */}

          {/* Pricing Section */}
          {/* <div id="pricing" />
          <h2 className="text-4xl font-bold pb-8 sm:pb-12 text-center pt-4 xl:pt-8">
            {dict.pricingPage.chooseYourPlan}
          </h2>
          <Pricing
            dict={dict}
            lang={lang}
            email={email}
            offer={offer as any}
            pricingOptions={pricingOptions}
          /> */}

          {/* <div className="h-10" /> */}
        {/* </Container> */}
      </main>

      <Footer dict={dict} />
    </>
  );
}
