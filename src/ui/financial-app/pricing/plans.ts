export type SubscriptionPlan = "monthly" | "yearly";

export type PricingPlan = {
  title: string;
  price?: string;
  features: string[];
  buttonLabel: string;
  mostPopular?: boolean;
  period: string;
  planName: SubscriptionPlan;
  paymentLink?: string;
  isDiscount?: boolean;
  originalPrice?: string;
  pricingGroup?: string;
};

export const pricingPlans: {
  monthly: PricingPlan;
  yearly: PricingPlan;
} = {
  monthly: {
    title: "monthly",
    // price: "$4.99",
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
    // mostPopular: false,
    period: "PricingPlan",
    planName: "monthly",
    // paymentLink: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PLAN_PAYMENT_LINK,
  },
  yearly: {
    title: "yearly",
    // price: "$49",
    features: ["allPremiumFeatures", "save18Percent"],
    buttonLabel: "start7DayFreeTrial",
    // mostPopular: true,
    period: "yearly",
    planName: "yearly",
    // paymentLink:
    //   process.env.NEXT_PUBLIC_STRIPE_YEARLY_PREMIUM_PLAN_PAYMENT_LINK,
  },
};

// export const pricingPlans: {
//   default: PricingPlan[];
//   "20percent"?: PricingPlan[];
// } = {
//   default: [
//     {
//       title: "monthly",
//       price: "$4.99",
//       features: [
//         "trackExpenses",
//         "advancedAnalytics",
//         "unlimitedCategories",
//         "emotionAndSatisfactionTracking",
//         "spendingInsightsByEmotionAndCategory",
//         "prioritySupport",
//         "newFeaturesAndUpdatesRegularly",
//       ],
//       buttonLabel: "start7DayFreeTrial",
//       mostPopular: false,
//       period: "monthly",
//       planName: "monthly",
//       paymentLink: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PLAN_PAYMENT_LINK,
//     },
//     {
//       title: "yearly",
//       price: "$49",
//       features: ["allPremiumFeatures", "save18Percent"],
//       buttonLabel: "start7DayFreeTrial",
//       mostPopular: true,
//       period: "yearly",
//       planName: "yearly",
//       paymentLink:
//         process.env.NEXT_PUBLIC_STRIPE_YEARLY_PREMIUM_PLAN_PAYMENT_LINK,
//     },
//   ],
//   "20percent": [
//     {
//       title: "monthly",
//       price: "$3.97",
//       features: [
//         "trackExpenses",
//         "advancedAnalytics",
//         "unlimitedCategories",
//         "emotionAndSatisfactionTracking",
//         "spendingInsightsByEmotionAndCategory",
//         "prioritySupport",
//         "newFeaturesAndUpdatesRegularly",
//       ],
//       buttonLabel: "start7DayFreeTrial",
//       mostPopular: false,
//       period: "monthly",
//       planName: "monthly",
//       paymentLink:
//         process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PLAN_PAYMENT_LINK_20_PERCENT,
//       isDiscount: true,
//       originalPrice: "$4.99",
//     },
//     {
//       title: "yearly",
//       price: "$39",
//       features: ["allPremiumFeatures", "save18Percent"],
//       buttonLabel: "start7DayFreeTrial",
//       mostPopular: true,
//       period: "yearly",
//       planName: "yearly",
//       paymentLink:
//         process.env
//           .NEXT_PUBLIC_STRIPE_YEARLY_PREMIUM_PLAN_PAYMENT_LINK_20_PERCENT,
//       isDiscount: true,
//       originalPrice: "$49",
//     },
//   ],
// };
