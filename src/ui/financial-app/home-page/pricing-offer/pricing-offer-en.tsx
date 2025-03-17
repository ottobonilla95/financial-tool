import React from "react";
import { Button } from "../../../components";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export type PricingOfferSectionProps = {
  campaign?: string;
};

export const PricingOfferSectionEn = ({
  campaign,
}: PricingOfferSectionProps) => {
  let hotmartCheckoutUrl = process.env.HOTMART_CHECKOUT_URL;

  if (campaign) {
    hotmartCheckoutUrl = `${hotmartCheckoutUrl}&sck=${campaign}`;
  }

  return (
    <section
      id="pricing-offer"
      className="tracking-tight px-5 py-12 bg-neutral-100 rounded-md"
    >
      <h2 className="text-3xl font-bold mb-6 text-center">
        🚀 Get Lifetime Access to TrackMySpend
      </h2>
      <p className="text-lg mb-6 sm:text-center">
        One-time payment.<span className="font-bold"> No subscriptions.</span>{" "}
        Full control of your finances forever.
      </p>

      <h3 className="text-xl font-semibold mb-4 sm:text-center">
        Here’s everything you’ll get 👇
      </h3>

      <ul className="text-lg space-y-3 max-w-lg mx-auto">
        <li className="flex">
          <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
          <div className="flex-1">
            Detailed tracking software for expenses, income, and savings.
          </div>
        </li>
        <li className="flex">
          <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
          <div className="flex-1">
            Advanced charts to visualize your money intelligently.
          </div>
        </li>
        <li className="flex">
          <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
          <div className="flex-1">
            Month-over-month expense comparison to better understand your
            financial progress.
          </div>
        </li>
        <li className="flex">
          <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
          <div className="flex-1">
            Detailed expense analysis by category and by day.
          </div>
        </li>
        <li className="flex">
          <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
          <div className="flex-1">
            Psychology module: Understand the relationship between your
            spending, emotions, and satisfaction levels.
            <span className="line-through text-red-600">$50 USD</span>{" "}
            <span className="text-green-600 font-bold">Free</span>
          </div>
        </li>
        <li className="flex">
          <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
          <div className="flex-1">
            AI assistant that analyzes your finances and provides personalized
            tips <span className="line-through text-red-600">$61 USD</span>{" "}
            <span className="text-green-600 font-bold">Free</span>
          </div>
        </li>
      </ul>

      <h3 className="text-2xl font-semibold mb-4 text-red-600 mt-8 text-center">
        🔴 Last Days to Get TrackMySpend at 75% Off
      </h3>
      <p className="text-xl font-medium text-gray-700 mb-4 text-center">
        Regular price: <span className="line-through">$148 USD</span>
      </p>
      <p className="text-4xl font-bold text-green-600 mb-4 text-center">
        Now: $37 USD
      </p>
      <p className="text-gray-600 mb-2 text-center">
        One-time payment. Lifetime access. All features included.
      </p>

      <div className="flex justify-center">
        <div className="sm:max-w-[500px] ">
          <Button
            className="!py-10 text-center !text-lg bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg !text-2xl transition mt-6"
            href={hotmartCheckoutUrl}
          >
            🔥 Get Access Now
          </Button>
        </div>
      </div>
    </section>
  );
};
