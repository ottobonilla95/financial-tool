import { getDBUser, updateDBUser } from "@/src/data/user";
import { SubscriptionPlan } from "@/src/ui/financial-app/pricing";
import { headers } from "next/headers";
import stripe from "stripe";

const endpointSecret = process.env.STRIPE_CHECKOUT_WEBHOOK_SECRET as string;

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
    case "checkout.session.completed":
      const checkoutCompleted = event.data.object;

      const clientId = checkoutCompleted.client_reference_id;
      const stripeId = checkoutCompleted.customer as string;
      const subscriptionId = checkoutCompleted.subscription as string;

      const typeOfPayment = checkoutCompleted.metadata?.typeOfPayment;

      const isLifeTimePayment = typeOfPayment === "lifetime";

      if (isLifeTimePayment) {
        const user = await getDBUser({
          filters: { id: clientId as string },
          select: { id: true, subscription_id: true },
        });

        if (user?.subscriptionId) {
          const client = new stripe(process.env.STRIPE_SECRET_KEY as string);

          await client.subscriptions.cancel(user?.subscriptionId as string);
        }
        const newPlan: SubscriptionPlan = "lifetime";

        await updateDBUser({
          data: {
            subscription_plan: newPlan,
            subscription_id: null,
          },
          filters: {
            id: clientId as string,
          },
        });
      } else {
        const newPlan: SubscriptionPlan = "premium";

        await updateDBUser({
          data: {
            subscription_plan: newPlan,
            subscription_id: subscriptionId,
            stripeId,
          },
          filters: {
            id: clientId as string,
          },
        });
      }

      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return Response.json({});
}
