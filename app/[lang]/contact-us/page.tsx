import { AvailableLanguages, getDictionary } from "@/src/translations";
import { Container, Footer, Header } from "@/src/ui/components";
import { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: { lang: AvailableLanguages };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);

  return {
    title: dict.contactPage.meta.title,
    description: dict.contactPage.meta.description,
  };
}

export type ContactUsPageProps = {
  params: { lang: AvailableLanguages };
};

export default async function ContactUsPage({
  params: { lang },
}: ContactUsPageProps) {
  const dict = await getDictionary(lang);

  return (
    <>
      <Header lang={lang} dict={dict} />
      <main className="flex min-h-screen flex-col bg-neutral-800">
        <Container>
          <div className="mt-8 flex grow flex-col gap-4 text-neutral-100">
            <div className="flex flex-col justify-center gap-6">
              <h1 className="text-3xl  md:text-5xl font-bold">
                {dict.shared.contactUs}
              </h1>
              <p className="text-lg opacity-80 md:text-xl">
                {dict.contactPage.weWouldLoveToHearFromYou}
              </p>
              <p className="text-lg opacity-80 md:text-xl">
                {dict.contactPage.youCanSendUsAnEmailTo}
              </p>
              <p className="text-lg opacity-80 md:text-xl font-bold">
                <Link
                  href="mailto:support@trackmyspend.co"
                  className="text-blue-600"
                >
                  support@trackmyspend.co
                </Link>
              </p>
              <p className="text-lg opacity-80 md:text-xl">
                {dict.contactPage.weStriveToRespondWithin}
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer dict={dict} />
    </>
  );
}
