import { AvailableLanguages, getDictionary } from "@/src/translations";
import { IntlProvider } from "@/src/translations/provider";
import { LoginForm } from "@/src/ui/auth";
import { Container, Header } from "@/src/ui/components";

export type LoginPageProps = {
  params: { lang: AvailableLanguages };
  searchParams: { email?: string; variant: string; callbackUrl?: string };
};

export default async function LoginPage({
  params: { lang },
  searchParams: { email, variant, callbackUrl },
}: LoginPageProps) {
  const dict = await getDictionary(lang);

  const isSignupFinished = variant === "signup_finished";
  return (
    <IntlProvider lang={lang} dict={dict}>
      <div className="min-h-screen bg-neutral-800">
        <Header lang={lang} dict={dict} />

        <Container className="flex justify-center pt-20">
          <LoginForm email={email} isSignupFinished={isSignupFinished} callbackUrl={callbackUrl} />
        </Container>
      </div>
    </IntlProvider>
  );
}
