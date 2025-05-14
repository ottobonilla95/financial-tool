import React from "react";
import { Button } from "../../../components";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { GiftIcon } from "@heroicons/react/24/outline";

export type PricingOfferSectionProps = {
  campaign?: string;
};

export const PricingOfferSectionEn = ({
  campaign,
}: PricingOfferSectionProps) => {
  let hotmartCheckoutUrl = process.env.HOTMART_CHECKOUT_URL_EN;

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
              <p className="text-sm text-gray-600">Image Coming Soon</p>
              <p className="text-xs text-gray-500">Software Interface Preview</p>
            </div>
          </div>
          <div className="flex-1">
            <ul className="space-y-3">
              <li className="flex">
                <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
                <div className="flex-1">
                  Detailed tracking software for expenses, income, and savings
                </div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
                <div className="flex-1">
                  Advanced charts to visualize your money intelligently
                </div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
                <div className="flex-1">
                  Month-over-month expense comparison
                </div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
                <div className="flex-1">
                  Detailed expense analysis by category and by day
                </div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
                <div className="flex-1">
                  Multi-currency support for global money management
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Gift Section 1 - Premium Features */}
      <div className="mb-12 p-6 bg-white rounded-xl shadow-sm border-2 border-dashed border-green-200">
        <div className="flex items-center justify-center mb-4">
          <GiftIcon className="w-8 h-8 text-green-500 mr-2" />
          <h3 className="text-xl font-bold">Gift #1: Premium Features</h3>
        </div>
        <p className="text-center mb-6 text-gray-600">
          <span className="line-through text-red-600">$210 USD Value</span>{" "}
          <span className="text-green-600 font-bold">Free Forever</span>
        </p>
        <ul className="space-y-3">
          <li className="flex">
            <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
            <div className="flex-1">
              Psychology module: Understand your spending emotions and satisfaction levels
            </div>
          </li>
          <li className="flex">
            <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
            <div className="flex-1">
              AI assistant with personalized financial tips
            </div>
          </li>
          <li className="flex">
            <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
            <div className="flex-1">
              Priority email support and feature requests
            </div>
          </li>
          <li className="flex">
            <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
            <div className="flex-1">
              Lifetime app updates and new features
            </div>
          </li>
        </ul>
      </div>

      {/* Gift Section 2 - First eBook */}
      <div className="mb-12 p-6 bg-white rounded-xl shadow-sm border-2 border-dashed border-green-200">
        <div className="flex items-center justify-center mb-4">
          <GiftIcon className="w-8 h-8 text-green-500 mr-2" />
          <h3 className="text-xl font-bold">Gift #2: [eBook 1 Title]</h3>
        </div>
        <p className="text-center mb-6 text-gray-600">
          <span className="line-through text-red-600">$29 USD Value</span>{" "}
          <span className="text-green-600 font-bold">Free</span>
        </p>
        
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/3">
            <div className="bg-gray-100 rounded-lg p-4 mb-4 aspect-[3/4]">
              <p className="text-sm text-gray-600">eBook Cover</p>
              <p className="text-xs text-gray-500">Coming Soon</p>
            </div>
          </div>
          <div className="md:w-2/3">
            <p className="text-lg mb-4">
              [Brief description of eBook 1 and its benefits. What the reader will learn and how it will help them with their finances.]
            </p>
            <ul className="space-y-2">
              <li className="flex">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                <div className="flex-1">Key benefit 1</div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                <div className="flex-1">Key benefit 2</div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                <div className="flex-1">Key benefit 3</div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Gift Section 3 - Second eBook */}
      <div className="mb-12 p-6 bg-white rounded-xl shadow-sm border-2 border-dashed border-green-200">
        <div className="flex items-center justify-center mb-4">
          <GiftIcon className="w-8 h-8 text-green-500 mr-2" />
          <h3 className="text-xl font-bold">Gift #3: [eBook 2 Title]</h3>
        </div>
        <p className="text-center mb-6 text-gray-600">
          <span className="line-through text-red-600">$29 USD Value</span>{" "}
          <span className="text-green-600 font-bold">Free</span>
        </p>
        
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/3">
            <div className="bg-gray-100 rounded-lg p-4 mb-4 aspect-[3/4]">
              <p className="text-sm text-gray-600">eBook Cover</p>
              <p className="text-xs text-gray-500">Coming Soon</p>
            </div>
          </div>
          <div className="md:w-2/3">
            <p className="text-lg mb-4">
              [Brief description of eBook 2 and its benefits. What the reader will learn and how it will help them with their finances.]
            </p>
            <ul className="space-y-2">
              <li className="flex">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                <div className="flex-1">Key benefit 1</div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                <div className="flex-1">Key benefit 2</div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                <div className="flex-1">Key benefit 3</div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Gift Section 4 - Third eBook */}
      <div className="mb-12 p-6 bg-white rounded-xl shadow-sm border-2 border-dashed border-green-200">
        <div className="flex items-center justify-center mb-4">
          <GiftIcon className="w-8 h-8 text-green-500 mr-2" />
          <h3 className="text-xl font-bold">Gift #4: [eBook 3 Title]</h3>
        </div>
        <p className="text-center mb-6 text-gray-600">
          <span className="line-through text-red-600">$29 USD Value</span>{" "}
          <span className="text-green-600 font-bold">Free</span>
        </p>
        
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/3">
            <div className="bg-gray-100 rounded-lg p-4 mb-4 aspect-[3/4]">
              <p className="text-sm text-gray-600">eBook Cover</p>
              <p className="text-xs text-gray-500">Coming Soon</p>
            </div>
          </div>
          <div className="md:w-2/3">
            <p className="text-lg mb-4">
              [Brief description of eBook 3 and its benefits. What the reader will learn and how it will help them with their finances.]
            </p>
            <ul className="space-y-2">
              <li className="flex">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                <div className="flex-1">Key benefit 1</div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                <div className="flex-1">Key benefit 2</div>
              </li>
              <li className="flex">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                <div className="flex-1">Key benefit 3</div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Total Value & Call to Action */}
      <div className="text-center bg-green-50 rounded-xl p-8 mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-red-600">
          🔴 Limited Time Special Offer
        </h3>
        <div className="mb-6">
          <div className="mb-4">
            <p className="text-base text-gray-600 mb-1">Total Package Value:</p>
            <ul className="text-sm text-gray-600 space-y-1 mb-3">
              <li>TrackMySpend Software: $57</li>
              <li>Premium Features Bundle: $147</li>
              <li>3 Financial eBooks: $87</li>
            </ul>
            <p className="text-lg font-medium text-gray-700">
              Regular Price: <span className="line-through">$291 USD</span>
            </p>
          </div>
          <p className="text-4xl font-bold text-green-600 mb-2">
            Today: $47 USD
          </p>
          <p className="text-gray-600">
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
            🔥 Get Access Now
          </Button>
        </div>
      </div>
    </section>
  );
};
