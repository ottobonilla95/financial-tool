import { AvailableLanguages, getDictionary } from "@/src/translations";
import { Metadata } from "next";
import { Container, Footer, Header } from "@/src/ui/components";
import { EnPrivacyPolicy } from "@/src/ui/policies/en/privacy-policy";
import { EsPrivacyPolicy } from "@/src/ui/policies/es/privacy-policy";

export async function generateMetadata({
  params,
}: {
  params: { lang: AvailableLanguages };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);

  return {
    title: dict.privacyPolicyPage.meta.title,
    description: dict.privacyPolicyPage.meta.description,
  };
}

export type PrivacyPolicyPageProps = {
  params: { lang: AvailableLanguages };
};

export default async function PrivacyPolicyPage({
  params: { lang },
}: PrivacyPolicyPageProps) {
  const dict = await getDictionary(lang);
  const policies = { es: EsPrivacyPolicy, en: EnPrivacyPolicy };
  const Policy = policies[lang];

  return (
    <>
      <main className="flex min-h-screen flex-col">
        <Header lang={lang} dict={dict} />
        <Container>
          <Policy />
        </Container>
      </main>
      <Footer dict={dict} />
    </>
  );
}
