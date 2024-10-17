import { getDBUser, updateDBUser } from "@/src/data/user";
import { SubscriptionPlan } from "@/src/ui/financial-app/pricing";
import { headers } from "next/headers";
import stripe from "stripe";

const endpointSecret = process.env.STRIPE_SUBSCRIPTION_WEBHOOK_SECRET as string;

export async function POST(request: Request) {
  const body = await request.text();
  const sig = headers().get("stripe-signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    return Response.json(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "customer.subscription.deleted":
      const customerSubscriptionDeleted = event.data.object;

      const stripeId = customerSubscriptionDeleted.customer;

      const newPlan: SubscriptionPlan = "free";

      const user = await getDBUser({
        filters: { stripeId: stripeId as string },
      });

      if (user) {
        await updateDBUser({
          data: {
            subscription_plan: newPlan,
          },
          filters: {
            stripeId: stripeId as string,
          },
        });
      }
      break;

    case "customer.subscription.updated":
      const customerSubscriptionUpdated = event.data.object;

      const stripeIdToUpdate = customerSubscriptionUpdated.customer;
      const cancelAt = customerSubscriptionUpdated.cancel_at;

      await updateDBUser({
        data: {
          subscription_cancel_at: cancelAt,
        },
        filters: {
          stripeId: stripeIdToUpdate as string,
        },
      });

      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return Response.json({});
}
