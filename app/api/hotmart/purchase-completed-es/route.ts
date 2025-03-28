import { createDbUser, getDBUser, updateDBUser } from "@/src/data/user";
import axios from "axios";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const body = await req.json();

  const email = body.data.buyer.email;
  const name = body.data.buyer.name;

  try {
    // First check if user exists in our database
    const existingUser = await getDBUser({
      filters: {
        email,
      },
    });

    // Handle Systeme.io operations
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
    let contactId;

    if (userFound) {
      contactId = userFoundResponse.data.items[0].id;
    } else {
      try {
        const createUserOptions = {
          method: "POST",
          url: "https://api.systeme.io/api/contacts",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            "X-API-Key": process.env.SYSTEME_API_KEY,
          },
          data: { email },
        };

        const response = await axios.request(createUserOptions);
        contactId = response.data.id;
      } catch (error) {
        console.log(error);
      }
    }

    if (contactId) {
      // Add tags to Systeme.io user
      const addTagOptions = {
        method: "POST",
        url: `https://api.systeme.io/api/contacts/${contactId}/tags`,
        headers: {
          "content-type": "application/json",
          "X-API-Key": process.env.SYSTEME_API_KEY,
        },
        data: { tagId: Number(process.env.SYSTEME_TRACKMYSPEND_TAG_ID) },
      };

      await axios.request(addTagOptions);

      const premiumTagId = process.env.SYSTEME_TRACKMYSPEND_PREMIUM_ES_TAG_ID;

      const add2TagOptions = {
        method: "POST",
        url: `https://api.systeme.io/api/contacts/${contactId}/tags`,
        headers: {
          "content-type": "application/json",
          "X-API-Key": process.env.SYSTEME_API_KEY,
        },
        data: {
          tagId: Number(premiumTagId),
        },
      };

      await axios.request(add2TagOptions);
    }

    if (existingUser) {
      // Update existing user
      await updateDBUser({
        filters: {
          email,
        },
        data: {
          subscription_plan: "lifetime",
        },
      });
    } else {
      // Create new user
      const defaultPassword = "Trackmyspend.24!";
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      await createDbUser({
        email,
        lang: "en",
        password: hashedPassword,
        name,
        pricing_Group: "one_time_purchase",
        fullySignedUp: true,
        subscriptionPlan: "lifetime",
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error in purchase-completed-es:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
