import React from "react";

export const Pricing = () => {
  const pricingPlans = [
    {
      title: "Free Plan",
      price: "$0",
      features: ["Track expenses", "Basic reporting", "Budget management"],
      buttonLabel: "Get Started",
    },
    {
      title: "Premium Plan",
      price: "$9.99/month",
      features: ["Advanced analytics", "Goal tracking", "Priority support"],
      buttonLabel: "Upgrade Now",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-10">Choose Your Plan</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {pricingPlans.map((plan, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">{plan.title}</h3>
              <p className="text-4xl font-bold mb-4">{plan.price}</p>
              <ul className="mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="text-gray-600 mb-2">
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg">
                {plan.buttonLabel}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
