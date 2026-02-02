import React from "react";
import { ShieldCheckIcon } from "@heroicons/react/24/solid";

export const GuaranteeSectionEn = () => {
  return (
    <section id="guarantee" className="tracking-tight text-center bg-gray-100">
      <div className="flex justify-center">
        <img
          src={`/images/guarantee/15-days-guarantee-en.png`}
          alt="15-Day Guarantee"
          className="w-full mb-6 sm:max-w-[300px]"
        />
      </div>

      <h2 className="text-3xl font-bold mb-6">Satisfaction Guarantee</h2>
      <p className="text-lg mb-6">
        We are confident that <strong>TrackMySpend</strong>{" "}
        <span className="font-bold">
          will transform the way you manage money
        </span>
        . That's why we guarantee that if, within 15 days, you don’t see the
        value you expected, we will refund{" "}
        <span className="font-bold">every penny</span>, no questions asked and
        no unnecessary procedures.
      </p>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <ShieldCheckIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-semibold mb-4">🚀 Risk-Free Access</h3>
        <p className="text-gray-600 mb-6">
          <strong>Our commitment is your peace of mind.</strong> You can try{" "}
          <strong>TrackMySpend</strong> worry-free and take control of your
          finances with complete confidence.
        </p>
        <p className="text-gray-600 mb-6">
          <span className="font-bold">The only risk</span> you take is
          continuing to lose control of your money. Now is the time to change
          that!
        </p>
      </div>
    </section>
  );
};
