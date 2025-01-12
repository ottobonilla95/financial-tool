import { getDBUser, updateDBUser } from "@/src/data/user";
import { SubscriptionPlan } from "@/src/ui/financial-app/pricing";
import { headers } from "next/headers";
import stripe from "stripe";
import axios from "axios";

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

      const newPlan: SubscriptionPlan = checkoutCompleted.metadata
        ?.subscription as SubscriptionPlan;

      await updateDBUser({
        data: {
          subscription_plan: newPlan,
          subscription_id: subscriptionId,
          stripeId,
          subscription_cancel_at: null,
        },
        filters: {
          id: clientId as string,
        },
      });

      const user = await getDBUser({
        filters: {
          id: clientId as string,
        },
      });

      const email = user?.email;

      const getUserByEmailOptions = {
        method: "GET",
        url: `https://api.systeme.io/api/contacts?email=${email}`,
        headers: {
          accept: "application/json",
          "X-API-Key": process.env.SYSTEME_API_KEY,
        },
      };

      const userFoundResponse = await axios.request(getUserByEmailOptions);

      const userFound = userFoundResponse.data.items.length > 0;

      if (userFound) {
        const contactId = userFoundResponse.data.items[0].id;

        const addPremiumTagOptions = {
          method: "POST",
          url: `https://api.systeme.io/api/contacts/${contactId}/tags`,
          headers: {
            "content-type": "application/json",
            "X-API-Key": process.env.SYSTEME_API_KEY,
          },
          data: {
            tagId: Number(process.env.SYSTEME_TRACKMYSPEND_PREMIUM_TAG_ID),
          },
        };

        await axios.request(addPremiumTagOptions);

        const removeNotSubscribedTagOptions = {
          method: "DELETE",
          url: `https://api.systeme.io/api/contacts/${contactId}/tags/${process.env.SYSTEME_TRACKMYSPEND_NOT_SUBSCRIBED_TAG_ID}`,
          headers: { "X-API-Key": process.env.SYSTEME_API_KEY },
        };

        await axios.request(removeNotSubscribedTagOptions);
      }

      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return Response.json({});
}
