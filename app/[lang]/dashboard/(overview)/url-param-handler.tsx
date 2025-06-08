"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const URLParamHandler = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const hasMonth = searchParams.get('month');
    const hasYear = searchParams.get('year');
    console.log('xx:asMonth', hasMonth)
    console.log('xx:asYear', hasYear)


    if (!hasMonth || !hasYear) {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      console.log('xx:currentMonth', currentMonth)
      console.log('xx:currentYear', currentYear)
      
      const newSearchParams = new URLSearchParams(searchParams);
      if (!hasMonth) newSearchParams.set('month', currentMonth.toString());
      if (!hasYear) newSearchParams.set('year', currentYear.toString());
      
      console.log('xx:newSearchParams', newSearchParams)
      router.replace(`?${newSearchParams.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);

  return null; // This component doesn't render anything
}; 