import React from "react";
import { Button } from "../../../components";

export const YourRelationWithMoneyWillChangeEn = () => {
  return (
    <section id="key-features" className="tracking-tight">
      <h2 className="text-2xl font-bold mb-6 text-center">
        What if I told you there's an easy way to take control of your money in
        minutes?
      </h2>
      <p className="text-lg mb-6">
        <strong>TrackMySpend</strong> gives you the financial clarity you've
        always needed.
      </p>
      <ul className="text-lg mb-6 space-y-4 text-left inline-block">
        <li>
          ✅{" "}
          <span>
            <strong>Discover where your money goes</strong> and find saving
            opportunities.
          </span>
        </li>
        <li>
          ✅ <strong>Eliminate the stress</strong> of not knowing if you'll make
          it to the end of the month.
        </li>
        <li>
          ✅{" "}
          <span>
            <strong>Receive AI-powered personalized tips</strong> based on your
            habits and emotions.
          </span>
        </li>

        <li>
          ✅{" "}
          <span>
            <strong>Identify hidden patterns</strong> in your finances and make
            better decisions.
          </span>
        </li>
      </ul>
      <h3 className="text-xl font-semibold mb-4 text-center">
        💡 Imagine this:
      </h3>
      <p className="text-lg mb-6">
        ❌ <strong>Before:</strong> Checking your bank account without a clue
        where your money went.
      </p>
      <p className="text-lg mb-6">
        ✅ <strong>After:</strong> Having total clarity over your finances,
        saving more, and feeling stress-free.
      </p>
      <p className="text-lg mb-6 font-semibold text-red-600 text-center">
        📌 It's time to take control of your finances and transform your future.
      </p>
      <Button
        className="!py-10 !font-bold mt-4 !text-xl group rounded-lg bg-[#1cde98] font-medium text-black hover:opacity-70 focus-visible:outline-black active:opacity-80 border-0 min-w-[300px]"
        iconPosition="left"
        href="#offer"
      >
        👉 Start today and change your financial life
      </Button>
    </section>
  );
};
