import { AvailableLanguages, getDictionary } from "@/src/translations";
import AppLogo from "@/src/ui/app-logo";
import { Footer, Header } from "@/src/ui/components";
import { Pricing } from "@/src/ui/financial-app/home-page";
import { LanguagePicker } from "@/src/ui/language-picker";
import { Metadata } from "next";
import Link from "next/link";

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
        <Header lang={lang} />
        <h2 className="text-4xl font-bold mb-10 text-center pt-16">
          Choose Your Plan
        </h2>
        <Pricing />
      </main>
      <Footer dict={dict} />
    </>
  );
}
