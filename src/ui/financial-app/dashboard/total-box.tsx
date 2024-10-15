import { Price } from "../../components";
import clsx from "clsx";

export type DashboardTotalsProps = {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconClassName?: string;
};

export const DashboardTotalBox = ({
  label,
  value,
  icon,
  iconClassName,
}: DashboardTotalsProps) => {
  return (
    <div className="bg-white shadow-sm px-5 py-4 cursor-pointer rounded-sm w-full lg:max-w-[220px]">
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-500 flex items-center"> {label}</div>
        <div
          className={clsx(
            "w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md",
            iconClassName
          )}
        >
          {icon}
        </div>
      </div>
      <div>
        <Price amount={value} className="text-2xl text-gray-600 font-bold" />
      </div>
    </div>
  );
};
