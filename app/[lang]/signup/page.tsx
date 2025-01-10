import { getAllCurrencies } from "@/src/data/currency";
import { AvailableLanguages, getDictionary } from "@/src/translations";
import { IntlProvider } from "@/src/translations/provider";
import { SignupForm } from "@/src/ui/auth";
import { Container, Header } from "@/src/ui/components";

export type SignupPageProps = {
  params: { lang: AvailableLanguages };
  searchParams: { email: string };
};

export default async function SignupPage({
  params: { lang },
  searchParams: { email },
}: SignupPageProps) {
  const dict = await getDictionary(lang);

  const currencies = await getAllCurrencies();

  return (
    <IntlProvider lang={lang} dict={dict}>
      <div className="min-h-screen bg-neutral-800">
        <Header lang={lang} dict={dict} />
        <Container className="flex justify-center pt-20">
          <SignupForm currencies={currencies} email={email} />
        </Container>
      </div>
    </IntlProvider>
  );
}
