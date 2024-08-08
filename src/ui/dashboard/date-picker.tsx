"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { usePathname, useSearchParams } from "next/navigation";
import { format, addMonths, subMonths, isAfter } from "date-fns";
import { Button } from "../components/atoms";

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

  const isNextDisabled = isAfter(addMonths(currentDate, 1), new Date());

  return (
    <div className="flex justify-center">
      <div className="flex">
        <Button href={handlePrevMonth()}>
          <ArrowLeftIcon className="w-4" />
        </Button>

        <div className="flex items-center font-medium mx-3 text-xl">
          {format(currentDate, "MMMM yyyy")}
        </div>

        <Button href={handleNextMonth()} isDisabled={isNextDisabled}>
          <ArrowRightIcon className="w-4" />
        </Button>
      </div>
    </div>
  );
};
