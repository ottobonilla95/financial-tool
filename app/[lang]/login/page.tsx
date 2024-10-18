import { AvailableLanguages, getDictionary } from "@/src/translations";
import { IntlProvider } from "@/src/translations/provider";
import AppLogo from "@/src/ui/app-logo";
import { LoginForm } from "@/src/ui/auth";
import { Header } from "@/src/ui/components";
import Link from "next/link";

export type LoginPageProps = {
  params: { lang: AvailableLanguages };
};

export default async function LoginPage({ params: { lang } }: LoginPageProps) {
  const dict = await getDictionary(lang);

  return (
    <IntlProvider lang={lang} dict={dict}>
      <div className="min-h-screen bg-neutral-800">
        <Header lang={lang} dict={dict} />
        <div className="flex h-full items-center justify-center mt-32">
          <LoginForm dict={dict} />
        </div>
      </div>
    </IntlProvider>
  );
}
