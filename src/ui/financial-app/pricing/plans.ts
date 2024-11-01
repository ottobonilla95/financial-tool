export type SubscriptionPlan = "free" | "premium" | "lifetime";

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
    title: "basicPlan",
    price: "free",
    features: ["trackExpenses", "basicReporting", "upTo9Categories"],
    buttonLabel: "getStarted",
    mostPopular: false,
    period: "monthly",
    planName: "free",
  },
  {
    title: "premiumPlan",
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
    buttonLabel: "subscribe",
    mostPopular: true,
    period: "monthly",
    planName: "premium",
    paymentLink: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PLAN_PAYMENT_LINK,
  },
  {
    title: "lifeTimeDeal",
    price: "$49",
    features: ["allPremiumFeatures"],
    buttonLabel: "oneTimePayment",
    mostPopular: false,
    period: "lifetime",
    planName: "lifetime",
    paymentLink: process.env.NEXT_PUBLIC_STRIPE_LIFETIME_DEAL_PLAN_PAYMENT_LINK,
  },
];
