import { Expense } from "@/src/types";
import { ExpenseTable } from "../components/molecules";
import { Button } from "../components/atoms";
import { PlusIcon } from "@heroicons/react/24/outline";

export type DashboardButtonsProps = {};

export const DashboardButtons = ({}: DashboardButtonsProps) => {
  return (
    <div className="mb-10 flex justify-end">
      <Button
        icon={<PlusIcon className="w-4" />}
        href="/dashboard/expenses/create"
      >
        Agregar gasto
      </Button>
    </div>
  );
};
