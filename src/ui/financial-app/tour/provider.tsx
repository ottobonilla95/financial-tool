"use client";

import { useTranslations } from "@/src/translations/use-translations";
import { StepType, TourProvider as TourProviderLib } from "@reactour/tour";

export type DashboardPageProps = {
  children: React.ReactNode;
};

export default function TourProvider({ children }: DashboardPageProps) {
  const { dict } = useTranslations();
  const steps: StepType[] = [
    {
      selector: ".tour-step-1",
      content: dict.tour?.step1 || "",
    },
    {
      selector: ".tour-step-2",
      content: dict.tour?.step2 || "",
    },
    {
      selector: ".tour-step-3",
      content: dict.tour?.step3 || "",
    },
    {
      selector: ".tour-step-4",
      content: dict.tour?.step4 || "",
    },
    {
      selector: ".tour-step-5",
      content: dict.tour?.step5 || "xxxxxx",
    },
    {
      selector: ".tour-step-6",
      content: dict.tour?.step6 || "",
    },
    {
      selector: ".tour-step-7",
      content: dict.tour?.step7 || "",
    },
    {
      selector: ".tour-step-8",
      content: dict.tour?.step8 || "",
    },
  ];

  return <TourProviderLib steps={steps}>{children}</TourProviderLib>;
}
