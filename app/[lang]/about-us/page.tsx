import { AvailableLanguages, getDictionary } from "@/src/translations";
import AppLogo from "@/src/ui/app-logo";
import { Footer } from "@/src/ui/components";
import Link from "next/link";

export type AboutUsPageProps = {
  params: { lang: AvailableLanguages };
};
export default async function AboutUsPage({
  params: { lang },
}: AboutUsPageProps) {
  const dict = await getDictionary(lang);

  return (
    <>
      <main className="flex min-h-screen flex-col p-6">
        <div className="flex h-20 shrink-0 items-center rounded-lg bg-black p-4 md:h-[150px] sm:pl-10">
          <Link href="/">
            <AppLogo />
          </Link>
        </div>
        <div className="mt-4 flex grow flex-col gap-4">
          <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10">
            <h1 className="text-xl text-gray-800 md:text-3xl font-bold">
              {dict.aboutUsPage.aboutUs}
            </h1>
            <p className="text-lg text-gray-700 md:text-xl">
              {dict.aboutUsPage.aboutUsDescription}
            </p>
            <p className="text-lg text-gray-700 md:text-xl">
              {dict.aboutUsPage.aboutUsDescription2}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
