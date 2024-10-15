"use client";

import { Saving } from "@/src/types";
import { format } from "date-fns";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Button, Price } from "../../components";
import { useState } from "react";
import { Tooltip } from "react-tooltip";
import { DeleteSavingForm } from "../saving/delete-form";

const calculateTotal = (savings: Saving[]) => {
  return savings.reduce((acc, saving) => acc + saving.amount, 0);
};

export type SavingTableProps = { savings: Saving[] };

export const SavingTable = ({ savings }: SavingTableProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [SavingIdToDelete, setSavingIdToDelete] = useState<string>();

  return (
    <>
      <Tooltip id="my-tooltip" />
      <DeleteSavingForm
        isOpen={isDeleteModalOpen}
        closeModal={() => setIsDeleteModalOpen(false)}
        savingId={SavingIdToDelete as string}
      />

      <div className="shadow-sm rounded-sm bg-white">
        <div className="h-[4px] rounded-t-sm bg-green-200" />
        <div className="grid grid-cols-4 py-2 px-4 text-gray-600">
          <div className="font-bold flex items-center">Description</div>
          <div className="font-bold flex items-center justify-center">
            Fecha
          </div>
          <div className="font-bold flex items-center justify-center">
            Cantidad
          </div>
          <div></div>
        </div>
        {savings.map((saving) => (
          <div
            key={saving.id}
            className="grid grid-cols-4 py-2 px-4 text-gray-500"
          >
            <div className="font-medium flex items-center">
              {saving.description}
            </div>

            <div className="flex items-center justify-center">
              {format(saving.date, "EEE dd")}
            </div>
            <div className="flex items-center justify-center">
              <Price amount={saving.amount} />
            </div>

            <div className="flex items-center justify-end">
              <Button
                onClick={() => {
                  setIsDeleteModalOpen(true);
                  setSavingIdToDelete(saving.id);
                }}
                className="!w-10"
              >
                <TrashIcon className="w-4" />
              </Button>
            </div>
          </div>
        ))}
        <div className="flex justify-between py-2 px-4 rounded text-gray-600">
          <div className="font-bold">Total</div>
          <div className="font-bold">{calculateTotal(savings).toFixed(2)}</div>
        </div>
      </div>
    </>
  );
};
