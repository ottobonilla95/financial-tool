import { AvailableLanguages, getDictionary } from "@/src/translations";
import { Footer, Header } from "@/src/ui/components";
import { Pricing } from "@/src/ui/financial-app/home-page";
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
};
export default async function AboutUsPage({
  params: { lang },
}: AboutUsPageProps) {
  const dict = await getDictionary(lang);

  return (
    <>
      <main className="flex min-h-screen flex-col">
        <Header dict={dict} lang={lang} />
        <h2 className="text-4xl font-bold mb-10 text-center pt-16">
          {dict.pricingPage.chooseYourPlan}
        </h2>
        <Pricing dict={dict} lang={lang} />
      </main>
      <Footer dict={dict} />
    </>
  );
}
