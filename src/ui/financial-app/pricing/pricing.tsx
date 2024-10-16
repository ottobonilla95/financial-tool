"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { Button } from "../../components";
import { useRouter } from "next/navigation";
import { pricingPlans } from "./plans";

export const Pricing = () => {
  const [period, setPeriod] = useState("monthly");

  const router = useRouter();

  const onButtonClick = (plan: string) => {
    router.push(`/signup?plan=${plan}`);
  };

  return (
    <section className="">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-center gap-4 px-10 sm:px-0">
          {pricingPlans.map((plan, index) => (
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
                      Most popular
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold mb-4">{plan.title}</h3>
                <div className="flex">
                  {plan.price === "free" ? (
                    <p className="text-4xl font-bold mb-4">Free</p>
                  ) : (
                    <>
                      <p className="text-4xl font-bold mb-4">
                        {plan.price === "free" ? "Free" : `US ${plan.price}`}
                      </p>
                      <div className="flex flex-col text-gray-500 text-xs leading-[18px] pl-1">
                        <span className="">per</span>
                        <span className="">month</span>
                      </div>
                    </>
                  )}
                </div>

                <ul className="mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="text-gray-600 mb-2">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                className="bg-black text-white text-lg font-medium"
                onClick={() => onButtonClick(plan.planName)}
              >
                {plan.buttonLabel}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
