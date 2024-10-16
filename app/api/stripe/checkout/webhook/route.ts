import { updateDBUser } from "@/src/data/user";
import { SubscriptionPlan } from "@/src/ui/financial-app/pricing";
import { headers } from "next/headers";
import stripe from "stripe";

const endpointSecret = "whsec_LDd7PeBnMaRx4ZvLawK3WLa4oSNsNsRw";

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
      const stripeId = checkoutCompleted.customer;

      const newPlan: SubscriptionPlan = "premium";
      await updateDBUser({
        data: {
          plan: newPlan,
          stripeId,
        },
        filters: {
          id: clientId as string,
        },
      });
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return Response.json({});
}
