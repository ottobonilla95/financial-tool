import { getDBUser, updateDBUser } from "@/src/data/user";
import { headers } from "next/headers";
import stripe from "stripe";
import axios from "axios";

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
        /// remove premiun tag options from systeme io
        const getUserByEmailOptions = {
          method: "GET",
          url: `https://api.systeme.io/api/contacts?email=${user.email}`,
          headers: {
            accept: "application/json",
            "X-API-Key": process.env.SYSTEME_API_KEY,
          },
        };

        const userFoundResponse = await axios.request(getUserByEmailOptions);

        const userFound = userFoundResponse.data.items.length > 0;

        if (userFound) {
          let contactId = userFoundResponse.data.items[0].id;

          if (contactId) {
            let premiumTagId;
            if (user?.lang === "es") {
              premiumTagId = process.env.SYSTEME_TRACKMYSPEND_PREMIUM_ES_TAG_ID;
            } else {
              premiumTagId = process.env.SYSTEME_TRACKMYSPEND_PREMIUM_EN_TAG_ID;
            }

            const removeNotSubscribedTagOptions = {
              method: "DELETE",
              url: `https://api.systeme.io/api/contacts/${contactId}/tags/${premiumTagId}`,
              headers: { "X-API-Key": process.env.SYSTEME_API_KEY },
            };

            await axios.request(removeNotSubscribedTagOptions);
          }
        }

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
