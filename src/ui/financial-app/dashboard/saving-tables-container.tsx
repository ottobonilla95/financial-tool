import { Saving } from "@/src/types";
import { SavingTable } from "./saving-table";
import { AppDictionary } from "@/src/translations";

export type SavingTableContainerProps = {
  savings: Saving[];
  dict: AppDictionary;
};

export const SavingTableContainer = ({
  savings,
  dict,
}: SavingTableContainerProps) => {
  return (
    <div className="mt-10">
      <div className="font-bold mb-5 text-gray-600 uppercase">
        {dict.shared.savings}
      </div>
      <div className="gap-4 grid grid-cols-1 lg:grid-cols-3 grid-flow-dense">
        <SavingTable savings={savings} />
      </div>
    </div>
  );
};
