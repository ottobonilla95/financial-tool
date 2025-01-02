"use client";

import { Earning, Expense } from "@/src/types";
import clsx from "clsx";
import { DeleteExpenseForm } from "../expenses/delete-expense-modal-form";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Button, Divider, Price } from "../../components";
import { useContext, useState } from "react";
import { Tooltip } from "react-tooltip";
import { AppDictionary } from "@/src/translations";
import { useBreakpoint } from "@/src/hooks";
import { abbreviateCurrency } from "@/src/helpers/abbreviate-currency";
import { AppContext } from "@/src/app-wrappper/provider";
import { ExpenseEmotionIcon, ExpenseSatisfactionIcon } from "./icons";

export type FinancialRecord = (Expense | Earning) & { type: string };

export type ExpenseByDayTableProps = {
  records: FinancialRecord[];
  dict: AppDictionary;
  isPremium: boolean;
};

export const ExpenseByDayTable = ({
  records,
  dict,
  isPremium,
}: ExpenseByDayTableProps) => {
  const { currency } = useContext(AppContext);
  const { isXs } = useBreakpoint("xs");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [expenseIdToDelete, setExpenseIdToDelete] = useState<string>();

  const calculateTotal = (expenses: FinancialRecord[]) =>
    expenses.reduce((acc, expense) => acc + expense.amount, 0);

  return (
    <>
      <Tooltip id="my-tooltip" />
      <DeleteExpenseForm
        isOpen={isDeleteModalOpen}
        closeModal={() => setIsDeleteModalOpen(false)}
        expenseId={expenseIdToDelete as string}
      />

      <div className="shadow-sm rounded-sm bg-white mb-6">
        <div className="flex items-center justify-between py-2 px-4 bg-gray-100 rounded-t-sm">
          <h2 className="font-bold text-lg text-gray-600">
            {records[0].formattedDate}
          </h2>
          <div className="flex gap-4">
            <div className="font-bold text-lime-500">
              <Price
                amount={calculateTotal(
                  records.filter((record) => record.type === "earning")
                )}
              />
            </div>
            <div className="font-bold text-red-500">
              <Price
                amount={calculateTotal(
                  records.filter((record) => record.type === "expense")
                )}
              />
            </div>
          </div>
        </div>

        <div
          className={clsx(
            "grid grid-cols-2 sm:grid-cols-3 py-2 px-4 text-gray-600 font-bold",
            {
              "!grid-cols-4 sm:!grid-cols-5": isPremium,
            }
          )}
        >
          <div>{dict.shared.name}</div>
          {isPremium && (
            <>
              <div className="text-center">{dict.shared.satisfaction}</div>
              <div className="text-center hidden sm:block">
                {dict.shared.emotion}
              </div>
            </>
          )}
          <div className="text-center">{dict.shared.price}</div>

          <div />
        </div>

        {records.map((record) => (
          <div
            key={record.id}
            className={clsx(
              "grid grid-cols-2 sm:grid-cols-3 py-2 px-4 text-gray-500",
              {
                "!grid-cols-4 sm:!grid-cols-5": isPremium,
              }
            )}
          >
            <div className="truncate">{record.description}</div>

            {isPremium && (
              <>
                <div className="text-center">
                  {record.type === "expense" && (
                    <ExpenseSatisfactionIcon
                      satisfaction={(record as Expense).satisfaction}
                    />
                  )}
                </div>
                <div className="text-center hidden sm:block">
                  {record.type === "expense" && (
                    <ExpenseEmotionIcon {...(record as Expense).emotion} />
                  )}
                </div>
              </>
            )}
            <div
              className={clsx("text-center text-lime-500", {
                "text-red-500": record.type === "expense",
              })}
            >
              {isXs ? (
                abbreviateCurrency(record.amount, currency.symbol)
              ) : (
                <Price amount={record.amount} />
              )}
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  setIsDeleteModalOpen(true);
                  setExpenseIdToDelete(record.id);
                }}
                className="!w-10"
              >
                <TrashIcon className="w-4" />
              </Button>
            </div>
          </div>
        ))}

        <div className="px-4">
          <Divider className="border-neutral-200" />
        </div>
      </div>
    </>
  );
};
