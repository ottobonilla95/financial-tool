import { AvailableLanguages, getDictionary } from "@/src/translations";
import { Container, Footer, Header } from "@/src/ui/components";
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
      <main className="flex min-h-screen flex-col bg-neutral-800 text-neutral-100">
        <Header lang={lang} dict={dict} />
        <Container>
          <div className="mt-8 flex grow flex-col gap-4">
            <div className="flex flex-col justify-center gap-6">
              <h1 className="text-3xl md:text-5xl font-bold">
                {dict.aboutUsPage.aboutUs}
              </h1>
              <p className="text-lg md:text-xl opacity-80">
                {dict.aboutUsPage.aboutUsDescription}
              </p>
              <p className="text-lg md:text-xl  opacity-80">
                {dict.aboutUsPage.aboutUsDescription2}
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer dict={dict} />
    </>
  );
}
