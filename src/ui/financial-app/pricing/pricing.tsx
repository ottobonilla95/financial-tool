"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { Button } from "../../components";
import { useRouter } from "next/navigation";
import { pricingPlans, SubscriptionPlan } from "./plans";
import { User } from "@/src/types";
import { AppDictionary } from "@/src/translations";
import { BanknotesIcon } from "@heroicons/react/24/solid";

export type PricingProps = {
  currenSubscriptionPlan?: SubscriptionPlan;
  user?: User;
  lang: string;
  dict: AppDictionary;
  showFreePlan?: boolean;
};
export const Pricing = ({
  currenSubscriptionPlan,
  user,
  lang,
  dict,
  showFreePlan = true,
}: PricingProps) => {
  const [period, setPeriod] = useState("monthly");

  const router = useRouter();

  const onButtonClick = (plan: string) => {
    if (!user) {
      router.push(`/signup?plan=${plan}`);
    } else {
      const selectedPlan = pricingPlans.find((p) => p.planName === plan);

      const paymentUrl = `${selectedPlan?.paymentLink}?client_reference_id=${user.id}&prefilled_email=${user.email}&locale=${lang}`;

      router.push(paymentUrl);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:justify-center gap-4 px-10 sm:px-0">
      {pricingPlans.map((plan, index) => {
        if (plan.planName === "free" && !showFreePlan) {
          return null;
        }
        const alreadySelected = plan.planName === currenSubscriptionPlan;
        return (
          <div
            key={index}
            className={clsx(
              "p-8 rounded-lg w-full sm:w-[320px] flex flex-col",
              {
                "border border-lime-500 border-solid ": plan.mostPopular,
              }
            )}
          >
            <div className="flex-1">
              <div className="mb-3 flex h-[20px]">
                {plan.mostPopular && (
                  <div className="bg-lime-500 flex items-center text-black px-[6px] h-[20px] rounded-md text-xs font-medium">
                    {dict.pricingPage.mostPopular}
                  </div>
                )}
              </div>

              <h3 className="text-lg font-semibold mb-4">
                {dict.pricingPage[plan.title as keyof typeof dict.pricingPage]}
              </h3>
              <div className="flex">
                {plan.price === "free" ? (
                  <p className="text-4xl font-bold mb-4">
                    {dict.pricingPage.free}
                  </p>
                ) : (
                  <>
                    <p className="text-4xl font-bold mb-4">
                      {plan.price === "free" ? "Free" : `US ${plan.price}`}
                    </p>
                    {plan.period !== "lifetime" && (
                      <div className="flex flex-col opacity-80 text-xs leading-[18px] pl-1">
                        <span className="">{dict.pricingPage.per}</span>
                        <span className="">{dict.pricingPage.month}</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              <ul className="mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="opacity-80 mb-2">
                    {dict.pricingPage[feature as keyof typeof dict.pricingPage]}
                  </li>
                ))}
              </ul>
            </div>
            {alreadySelected ? (
              <div>{dict.pricingPage.currentPlan}</div>
            ) : (
              <Button
                className="bg-lime-500 text-black text-lg font-medium group border-0"
                onClick={() => onButtonClick(plan.planName)}
                icon={
                  <BanknotesIcon className=" w-6 h-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-200 ease-in-out" />
                }
              >
                {
                  dict.pricingPage[
                    plan.buttonLabel as keyof typeof dict.pricingPage
                  ]
                }
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};
