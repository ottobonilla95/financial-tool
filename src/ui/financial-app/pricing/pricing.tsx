"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { Button } from "../../components";
import { useRouter } from "next/navigation";
import { pricingPlans, SubscriptionPlan } from "./plans";
import { User } from "@/src/types";
import { AppDictionary } from "@/src/translations";

export type PricingProps = {
  currenSubscriptionPlan?: SubscriptionPlan;
  user?: User;
  lang: string;
  dict: AppDictionary;
};
export const Pricing = ({
  currenSubscriptionPlan,
  user,
  lang,
  dict,
}: PricingProps) => {
  const [period, setPeriod] = useState("monthly");

  const router = useRouter();

  const onButtonClick = (plan: string) => {
    if (!user) {
      router.push(`/signup?plan=${plan}`);
    } else {
      const selectedPlan = pricingPlans.find((p) => p.planName === plan);

      const paymentLink =
        process.env[selectedPlan?.paymentLink as string] || "";

      const paymentUrl = `${paymentLink}?client_reference_id=${user.id}&prefilled_email=${user.email}&locale=${lang}`;

      router.push(paymentUrl);
    }
  };

  return (
    <section className="">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-center gap-4 px-10 sm:px-0">
          {pricingPlans.map((plan, index) => {
            const alreadySelected = plan.planName === currenSubscriptionPlan;
            return (
              <div
                key={index}
                className={clsx(
                  "p-8 rounded-lg w-full sm:w-[320px] flex flex-col",
                  {
                    "bg-gray-100 border border-gray-200 border-solid ":
                      plan.mostPopular,
                  }
                )}
              >
                <div className="flex-1">
                  <div className="mb-3 flex h-[20px]">
                    {plan.mostPopular && (
                      <div className="bg-white flex items-center text-gray-600 px-[6px] h-[20px] rounded-md text-xs font-medium">
                        {dict.pricingPage.mostPopular}
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold mb-4">
                    {
                      dict.pricingPage[
                        plan.title as keyof typeof dict.pricingPage
                      ]
                    }
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
                        <div className="flex flex-col text-gray-500 text-xs leading-[18px] pl-1">
                          <span className="">{dict.pricingPage.per}</span>
                          <span className="">{dict.pricingPage.month}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <ul className="mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="text-gray-600 mb-2">
                        {
                          dict.pricingPage[
                            feature as keyof typeof dict.pricingPage
                          ]
                        }
                      </li>
                    ))}
                  </ul>
                </div>
                {alreadySelected ? (
                  <div>{dict.pricingPage.currentPlan}</div>
                ) : (
                  <Button
                    className="bg-black text-white text-lg font-medium"
                    onClick={() => onButtonClick(plan.planName)}
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
      </div>
    </section>
  );
};
