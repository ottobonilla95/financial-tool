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
    title: "Basic Plan",
    price: "free",
    features: ["Track expenses", "Basic reporting", "Budget management"],
    buttonLabel: "Get Started",
    mostPopular: false,
    period: "monthly",
    planName: "free",
  },
  {
    title: "Premium Plan",
    price: "$4.99",
    features: [
      "Track expenses",
      "Basic reporting",
      "Budget management",
      "Advanced analytics",
      "Goal tracking",
      "Priority support",
    ],
    buttonLabel: "Subscribe",
    mostPopular: true,
    period: "monthly",
    planName: "premium",
    paymentLink:
      process.env.NODE_ENV === "production"
        ? "https://buy.stripe.com/test_28o9EwbX6bls32o288"
        : "https://buy.stripe.com/test_28o9EwbX6bls32o288",
  },
];
