import { createDbUser } from "@/src/data/user";
import axios from "axios";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const body = await req.json();

  const email = body.data.buyer.email;
  const name = body.data.buyer.name;

  // 1. see if user exists on system io
  try {
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
        console.log;
      }
    }

    if (contactId) {
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

      const premiumTagId = process.env.SYSTEME_TRACKMYSPEND_PREMIUM_EN_TAG_ID;

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

    const defaultPassword = "Trackmyspend.24!";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    await createDbUser({
      email,
      lang: "es",
      password: hashedPassword,
      name,
      pricing_Group: "one_time_purchase",
      fullySignedUp: true,
      subscriptionPlan: "lifetime",
    });
  } catch (error) {
    throw error;
  }

  return Response.json({ success: true });
}
