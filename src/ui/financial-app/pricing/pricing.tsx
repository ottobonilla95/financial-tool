"use client";

import React from "react";
import clsx from "clsx";
import { Button } from "../../components";
import { useRouter } from "next/navigation";
import { PricingPlan, pricingPlans, SubscriptionPlan } from "./plans";
import { OfferType, PricingOption, User } from "@/src/types";
import { AppDictionary } from "@/src/translations";
import { BanknotesIcon, CheckIcon } from "@heroicons/react/24/solid";

export type PricingProps = {
  currenSubscriptionPlan?: SubscriptionPlan;
  user?: User;
  lang: string;
  dict: AppDictionary;
  email?: string;
  offer?: OfferType;
  pricingOptions: PricingOption[];
};

const buildPricingPlans = (
  pricingOptions: PricingOption[],
  pricingPlans: {
    monthly: PricingPlan;
    yearly: PricingPlan;
  }
) => {
  const monthlyPricingOption = pricingOptions?.find(
    (pricingOption) => pricingOption.period === "monthly"
  );
  const yearlyPricingOption = pricingOptions?.find(
    (pricingOption) => pricingOption.period === "yearly"
  );

  const monthlyPricingPlan = pricingPlans.monthly;
  const monthlyPlan: PricingPlan = {
    ...monthlyPricingPlan,
    price: `$${monthlyPricingOption?.price}`,
    paymentLink: monthlyPricingOption?.paymentLink,
    pricingGroup: monthlyPricingOption?.pricingGroup,
  };

  const yearlyPricingPlan = pricingPlans.yearly;
  const yearlyPlan: PricingPlan = {
    ...yearlyPricingPlan,
    price: `$${yearlyPricingOption?.price}`,
    paymentLink: yearlyPricingOption?.paymentLink,
    pricingGroup: yearlyPricingOption?.pricingGroup,
  };

  return [monthlyPlan, yearlyPlan];
};
export const Pricing = ({
  currenSubscriptionPlan,
  user,
  lang,
  dict,
  email,
  offer,
  pricingOptions,
}: PricingProps) => {
  const pricingPlansToUse = buildPricingPlans(pricingOptions, pricingPlans);

  const router = useRouter();

  const onButtonClick = (period: string) => {
    const selectedPlan = pricingPlansToUse.find((p) => p.period === period);

    if (!user) {
      let url = `/signup?`;
      if (email) {
        url += `&email=${email}`;
      }
      if (offer) {
        url += `&offer=${offer}`;
      }
      router.push(url);

      sessionStorage.setItem("selectedPlan", JSON.stringify(selectedPlan));
    } else {
      const paymentUrl = `${selectedPlan?.paymentLink}?client_reference_id=${user.id}&prefilled_email=${user.email}&locale=${lang}`;

      router.push(paymentUrl);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:justify-center gap-4 sm:px-0">
      {pricingPlansToUse.map((plan, index) => {
        const alreadySelected = plan.planName === currenSubscriptionPlan;
        return (
          <div
            key={index}
            className={clsx(
              "p-8 rounded-lg w-full sm:w-[420px] flex flex-col",
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
                  <div>
                    {plan.isDiscount && (
                      <div className="flex relative">
                        <p className="text-xl font-bold mb-4">
                          <span className="line-through opacity-70 mr-2">{`US ${plan.originalPrice}`}</span>
                        </p>
                      </div>
                    )}

                    <div className="flex">
                      <p className="text-4xl font-bold mb-4">
                        {plan.price === "free" ? "Free" : `US ${plan.price}`}
                      </p>

                      <div className="flex flex-col opacity-80 text-xs leading-[18px] pl-1">
                        <span className="">{dict.pricingPage.per}</span>
                        <span className="">
                          {plan.planName === "monthly"
                            ? dict.pricingPage.month
                            : dict.pricingPage.year}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <ul className="mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="opacity-80 mb-2 flex gap-2">
                    <CheckIcon className="w-3" />
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
                onClick={() => onButtonClick(plan.period)}
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
