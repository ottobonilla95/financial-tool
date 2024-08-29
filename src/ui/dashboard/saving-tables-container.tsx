import { Saving } from "@/src/types";
import { SavingTable } from "./saving-table";

export type SavingTableContainerProps = {
  savings: Saving[];
};

export const SavingTableContainer = ({
  savings,
}: SavingTableContainerProps) => {
  return (
    <div className="mt-10">
      <div className="font-bold text-lg mb-5">Ahorros</div>
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-3 grid-flow-dense">
        <SavingTable savings={savings} />
      </div>
    </div>
  );
};
