"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { usePathname, useSearchParams } from "next/navigation";
import { format, addMonths, subMonths, isAfter } from "date-fns";
import { Button } from "../../components/atoms";

export const DashboardDatePicker = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const month = Number(searchParams.get("month"));
  const year = Number(searchParams.get("year"));

  const createUrl = (newDate: Date) => {
    const params = new URLSearchParams(searchParams);
    const month = newDate.getMonth() + 1;
    const year = newDate.getFullYear();
    params.set("month", month.toString());
    params.set("year", year.toString());

    return `${pathname}?${params.toString()}`;
  };

  let currentDate = new Date();

  if (month && year) {
    currentDate = new Date(Number(year), Number(month) - 1);
  }

  const handleNextMonth = () => {
    const newDate = addMonths(currentDate, 1);
    return createUrl(newDate);
  };

  const handlePrevMonth = () => {
    const newDate = subMonths(currentDate, 1);
    return createUrl(newDate);
  };

  // const isNextDisabled = isAfter(addMonths(currentDate, 1), new Date());

  return (
    <div className="flex justify-center items-center">
      <div className="w-10">
        <Button href={handlePrevMonth()} className="bg-white">
          <ArrowLeftIcon className="w-4" />
        </Button>
      </div>
      <div className="flex items-center font-bold mx-3 text-l,g justify-center text-gray-600">
        {format(currentDate, "MMMM yyyy")}
      </div>

      <div className="w-10">
        <Button
          href={handleNextMonth()}
          // isDisabled={isNextDisabled}
          className="bg-white"
        >
          <ArrowRightIcon className="w-4" />
        </Button>
      </div>
    </div>
  );
};
