import { getAllCurrencies } from "@/src/data/currency";
import { AvailableLanguages, getDictionary } from "@/src/translations";
import { IntlProvider } from "@/src/translations/provider";
import { SignupForm } from "@/src/ui/auth";
import { Container, Header } from "@/src/ui/components";
import { SubscriptionPlan } from "@/src/ui/financial-app/pricing";

export type SignupPageProps = {
  params: { lang: AvailableLanguages };
  searchParams: { plan: string; email: string; offer?: string };
};

export default async function SignupPage({
  params: { lang },
  searchParams: { plan, email, offer },
}: SignupPageProps) {
  const dict = await getDictionary(lang);

  const currencies = await getAllCurrencies();

  return (
    <IntlProvider lang={lang} dict={dict}>
      <div className="min-h-screen bg-neutral-800">
        <Header lang={lang} dict={dict} />
        <Container className="flex justify-center pt-20">
          <SignupForm
            currencies={currencies}
            plan={plan as SubscriptionPlan}
            email={email}
            offer={offer as any}
          />
        </Container>
      </div>
    </IntlProvider>
  );
}
