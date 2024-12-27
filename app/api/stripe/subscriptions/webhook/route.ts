import { getDBUser, updateDBUser } from "@/src/data/user";
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
  let user, stripeId;

  // Handle the event
  switch (event.type) {
    // this is fired when a customer's subscription is deleted
    case "customer.subscription.deleted":
      const customerSubscriptionDeleted = event.data.object;

      stripeId = customerSubscriptionDeleted.customer;

      user = await getDBUser({
        filters: { stripeId: stripeId as string },
      });

      if (user) {
        await updateDBUser({
          data: {
            subscription_plan: null,
          },
          filters: {
            stripeId: stripeId as string,
          },
        });
      }
      break;

    // This is fired when the user starts the cancellations but it is not yet cancelled
    case "customer.subscription.updated":
      const customerSubscriptionUpdated = event.data.object;

      stripeId = customerSubscriptionUpdated.customer;
      const cancelAt = customerSubscriptionUpdated.cancel_at;

      user = await getDBUser({
        filters: { stripeId: stripeId as string },
      });

      if (user) {
        await updateDBUser({
          data: {
            subscription_cancel_at: cancelAt,
          },
          filters: {
            stripeId: stripeId as string,
          },
        });
      }

      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return Response.json({});
}
