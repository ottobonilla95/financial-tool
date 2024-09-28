import { AppDictionary } from "@/src/translations";

export type NoExpensesAddedProps = {
  dict: AppDictionary;
};
export const NoExpensesAdded = ({ dict }: NoExpensesAddedProps) => {
  return (
    <div className="flex justify-center items-center my-10">
      <div className="bg-gray-200 rounded py-2 px-5">
        {dict.shared.noExpensesAdded}
      </div>
    </div>
  );
};
