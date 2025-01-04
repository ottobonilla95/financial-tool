export type SubscriptionPlan = "monthly" | "yearly";

export type PricingPlan = {
  title: string;
  price: string;
  features: string[];
  buttonLabel: string;
  mostPopular: boolean;
  period: string;
  planName: SubscriptionPlan;
  paymentLink?: string;
};

export const pricingPlans: PricingPlan[] = [
  {
    title: "monthly",
    price: "$4.99",
    features: [
      "trackExpenses",
      "advancedAnalytics",
      "unlimitedCategories",
      "emotionAndSatisfactionTracking",
      "spendingInsightsByEmotionAndCategory",
      "prioritySupport",
      "newFeaturesAndUpdatesRegularly",
    ],
    buttonLabel: "start7DayFreeTrial",
    mostPopular: true,
    period: "monthly",
    planName: "monthly",
    paymentLink: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PLAN_PAYMENT_LINK,
  },
  {
    title: "yearly",
    price: "$49",
    features: ["allPremiumFeatures"],
    buttonLabel: "start7DayFreeTrial",
    mostPopular: false,
    period: "yearly",
    planName: "yearly",
    paymentLink:
      process.env.NEXT_PUBLIC_STRIPE_YEARLY_PREMIUM_PLAN_PAYMENT_LINK,
  },
];
