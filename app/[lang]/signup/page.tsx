import { getAllCurrencies } from "@/src/data/currency";
import { AvailableLanguages, getDictionary } from "@/src/translations";
import { IntlProvider } from "@/src/translations/provider";
import AppLogo from "@/src/ui/app-logo";
import { SignupForm } from "@/src/ui/auth";
import Link from "next/link";

export type SignupPageProps = {
  params: { lang: AvailableLanguages };
};

export default async function SignupPage({
  params: { lang },
}: SignupPageProps) {
  const dict = await getDictionary(lang);

  const currencies = await getAllCurrencies();

  return (
    <IntlProvider lang={lang} dict={dict}>
      <main className="flex items-center justify-center">
        <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4">
          <div className="flex h-20 w-full items-end rounded-lg bg-black p-3 md:h-36">
            <div className="text-white flex items-center h-full w-full justify-center">
              <Link href="/">
                <AppLogo />
              </Link>
            </div>
          </div>
          <SignupForm currencies={currencies} dict={dict} />
        </div>
      </main>
    </IntlProvider>
  );
}
