import { Price } from "../../components";
import clsx from "clsx";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/solid";

function calculatePercentageChange(
  current: number,
  previous: number
): { percentageChange: number; isIncrease: boolean } {
  // Handle cases where previous or current balances are zero
  if (previous === 0) {
    return {
      percentageChange: current !== 0 ? 100 : 0,
      isIncrease: current > 0,
    };
  }

  // Check if we're dealing with a balance that can go negative
  const isBalance = current < 0 || previous < 0;

  // Calculate percentage change based on the absolute previous value
  const difference = current - previous;
  const absPrevious = Math.abs(previous);
  const percentageChange = (difference / absPrevious) * 100;

  // For balance: determine improvement based on moving closer to positive
  const isIncrease = isBalance ? current > previous : percentageChange > 0;

  return { percentageChange: Math.abs(percentageChange), isIncrease };
}

export type DashboardTotalsProps = {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconClassName?: string;
  previousMonthValue?: number;
  negativeIncrease?: boolean;
};

export const DashboardTotalBox = ({
  label,
  value,
  icon,
  iconClassName,
  previousMonthValue,
  negativeIncrease,
}: DashboardTotalsProps) => {
  const { percentageChange, isIncrease } = calculatePercentageChange(
    value,
    previousMonthValue || 0
  );

  console.log("aca", label, percentageChange, isIncrease);

  const renderGreen = () => {
    if (negativeIncrease) {
      if (isIncrease) {
        return false;
      } else {
        return true;
      }
    } else {
      if (isIncrease) {
        return true;
      } else {
        return false;
      }
    }
  };

  return (
    <div className="flex flex-col bg-white shadow-sm px-5 py-4 cursor-pointer rounded-sm w-full lg:max-w-[220px]">
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
      {percentageChange > 0 ? (
        <div
          className={clsx("flex gap-2 mb-1 text-red-500", {
            "!text-lime-500": renderGreen(),
          })}
        >
          <div
            className={clsx(
              "px-1 rounded-md py-[1px] flex items-center bg-red-100",
              {
                "!bg-lime-100": renderGreen(),
              }
            )}
          >
            {isIncrease ? (
              <ArrowTrendingUpIcon className="w-4" />
            ) : (
              <ArrowTrendingDownIcon className="w-4" />
            )}
          </div>

          {`${percentageChange.toFixed(2)} %`}
        </div>
      ) : (
        <div className="flex-1" />
      )}

      <div>
        <Price amount={value} className="text-2xl text-gray-600 font-bold" />
      </div>
    </div>
  );
};
