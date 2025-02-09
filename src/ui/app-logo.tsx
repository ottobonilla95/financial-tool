import { WalletIcon } from "@heroicons/react/24/solid";
import { bricolageGrotesque } from "@/src/styles/fonts";
import clsx from "clsx";

export type PageLogoProps = {
  variant?: "default" | "small";
};
export default function PageLogo({ variant = "default" }: PageLogoProps) {
  return (
    <div
      className={`${bricolageGrotesque.className} flex flex-row leading-none text-white gap-3 items-center jusfity-center`}
    >
      <WalletIcon
        className={clsx("h-8 w-8 rotate-[35deg] text-[#1cde98]", {
          "!h-6 !w-6": variant === "small",
        })}
      />
      <div
        className={clsx("text-[20px] sm:text-[28px] font-bold", {
          "text-[16px] sm:text-[20px]": variant === "small",
        })}
      >
        Track My Spend
      </div>
    </div>
  );
}
