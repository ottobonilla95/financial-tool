import { WalletIcon } from "@heroicons/react/24/solid";
import { bricolageGrotesque } from "@/src/styles/fonts";

export default function PageLogo() {
  return (
    <div
      className={`${bricolageGrotesque.className} flex flex-row leading-none text-white gap-3 items-center`}
    >
      <WalletIcon className="h-8 w-8 rotate-[35deg] text-lime-500" />
      <div className="text-[20px] sm:text-[28px] font-bold">Track My Spend</div>
    </div>
  );
}
