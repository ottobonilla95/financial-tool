import React from "react";
import { Button } from "../../../components";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export type PricingOfferSectionProps = {
  campaign?: string;
  fbclid?: string;
};

export const PricingOfferSectionEn = ({
  campaign,
  fbclid,
}: PricingOfferSectionProps) => {
  let hotmartCheckoutUrl = process.env.HOTMART_CHECKOUT_URL_EN;

  if (campaign) {
    hotmartCheckoutUrl = `${hotmartCheckoutUrl}&sck=${campaign}`;
  }

  if (fbclid) {
    hotmartCheckoutUrl = `${hotmartCheckoutUrl}&fbclid=${fbclid}`;
  }

  return (
    <section
      id="pricing-offer"
      className="tracking-tight px-5 py-12 bg-neutral-100 rounded-md"
    >
      <h2 className="text-3xl font-bold mb-6 text-center">
        Get Lifetime Access to TrackMySpend
      </h2>
      <p className="text-lg mb-10 sm:text-center">
        One-time payment.<span className="font-bold"> No subscriptions.</span>{" "}
        Full control of your finances forever.
      </p>

      {/* Main Product Section */}
      <div className="mb-12 p-6 bg-white rounded-xl shadow-sm">
        <h3 className="text-2xl font-bold mb-6 text-center">
          TrackMySpend - Complete Financial Control System
        </h3>

        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex-1">
            <div className="bg-gray-100 rounded-lg p-4 mb-6 text-center">
              <img
                src="/images/vslgif2.gif"
                alt="TrackMySpend Preview"
                className="rounded-lg w-full"
              />
            </div>
          </div>
          <div className="flex-1">
            <ul className="space-y-3">
              <li className="flex">
                <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                <div className="flex-1">
                  Detailed tracking software for expenses, income, and savings
                </div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                <div className="flex-1">
                  Advanced charts to visualize your money intelligently
                </div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                <div className="flex-1">
                  Month-over-month expense comparison
                </div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                <div className="flex-1">
                  Detailed expense analysis by category and by day
                </div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                <div className="flex-1">
                  Multi-currency support for global money management
                </div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                <div className="flex-1">
                  Psychology module: Understand your spending emotions and
                  satisfaction levels
                </div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                <div className="flex-1">
                  AI assistant with personalized financial tips
                </div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                <div className="flex-1">
                  Priority email support and feature requests
                </div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                <div className="flex-1">Lifetime app updates and new features</div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-green-50 rounded-xl p-8 mb-8">
        <div className="mb-6">
          <p className="text-4xl font-bold text-green-600 mb-2">$47 USD</p>
          <p className="text-gray-600 text-lg">
            One-time payment. Lifetime access. All features included.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Join hundreds of satisfied users already transforming their finances
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            className="!py-10 text-center !text-lg bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg !text-2xl transition"
            href={hotmartCheckoutUrl}
          >
            Get Access Now
          </Button>
        </div>
      </div>
    </section>
  );
};
