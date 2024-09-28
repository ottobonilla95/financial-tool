import { Spinner } from "@/src/ui/components";
import { WalletIcon } from "@heroicons/react/24/outline";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative h-[50px] w-[50px] items-center flex justify-center">
        <Spinner className="absolute  h-[50px] w-[50px] !fill-gray-200 text-white" />
        <WalletIcon className="w-8 h-8" />
      </div>
    </div>
  );
}
