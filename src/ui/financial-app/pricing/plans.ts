export type SubscriptionPlan = "free" | "premium";

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
      "emtionTrackingAndLevelOfSatisfaction",
      "prioritySupport",
    ],
    buttonLabel: "subscribe",
    mostPopular: true,
    period: "monthly",
    planName: "premium",
    paymentLink:
      process.env.NODE_ENV === "production"
        ? "https://buy.stripe.com/test_28o9EwbX6bls32o288"
        : "https://buy.stripe.com/test_28o9EwbX6bls32o288",
  },
];
