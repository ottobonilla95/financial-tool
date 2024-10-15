import { WalletIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/src/styles/fonts";

export default function PageLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white gap-3`}
    >
      <WalletIcon className="h-10 w-10 rotate-[15deg]" />
      <h1 className="text-[28px] sm:text-[34px]">Track My Spend</h1>
    </div>
  );
}
