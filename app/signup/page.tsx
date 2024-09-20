import { getAllCurrencies } from "@/src/data/currency";
import PageLogo from "@/src/ui/app-logo";
import { SignupForm } from "@/src/ui/auth";

export default async function SignupPage() {
  const currencies = await getAllCurrencies();

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="text-white flex items-center h-full w-full justify-center">
            <PageLogo />
          </div>
        </div>
        <SignupForm currencies={currencies} />
      </div>
    </main>
  );
}
