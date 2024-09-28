import { AvailableLanguages, getDictionary } from "@/src/translations";
import AppLogo from "@/src/ui/app-logo";
import { LoginForm } from "@/src/ui/auth";
import Link from "next/link";

export type LoginPageProps = {
  params: { lang: AvailableLanguages };
};

export default async function LoginPage({ params: { lang } }: LoginPageProps) {
  const dict = await getDictionary(lang);

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-black p-3 md:h-36">
          <div className="text-white flex items-center h-full w-full justify-center">
            <Link href="/">
              <AppLogo />
            </Link>
          </div>
        </div>
        <LoginForm dict={dict} />
      </div>
    </main>
  );
}
