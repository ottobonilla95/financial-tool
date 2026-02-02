import { createDbUser, getDBUser, updateDBUser } from "@/src/data/user";
import { sendWelcomeEmail } from "@/src/email";
import axios from "axios";
import bcrypt from "bcrypt";

function logSafeAxiosError(context: string, error: unknown) {
  if (axios.isAxiosError(error)) {
    console.error(context, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    });
    return;
  }

  console.error(context, error);
}

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

    let isNewUser = false;

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
      isNewUser = true;
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

    // Send welcome email for new users (non-blocking)
    if (isNewUser) {
      try {
        await sendWelcomeEmail({ to: email, name, lang: "en" });
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
      }
    }

    // Handle Systeme.io operations (best-effort; don't fail Hotmart webhook)
    try {
      const apiKey = process.env.SYSTEME_API_KEY;
      if (!apiKey) {
        throw new Error("Missing SYSTEME_API_KEY");
      }

      const userFoundResponse = await axios.request({
        method: "GET",
        url: `https://api.systeme.io/api/contacts?email=${email}`,
        headers: {
          accept: "application/json",
          "X-API-Key": apiKey,
        },
      });

      const userFound = userFoundResponse.data.items.length > 0;
      let contactId: string | undefined;

      if (userFound) {
        contactId = userFoundResponse.data.items[0].id;
      } else {
        const response = await axios.request({
          method: "POST",
          url: "https://api.systeme.io/api/contacts",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            "X-API-Key": apiKey,
          },
          data: { email },
        });

        contactId = response.data.id;
      }

      if (contactId) {
        await axios.request({
          method: "POST",
          url: `https://api.systeme.io/api/contacts/${contactId}/tags`,
          headers: {
            "content-type": "application/json",
            "X-API-Key": apiKey,
          },
          data: { tagId: Number(process.env.SYSTEME_TRACKMYSPEND_TAG_ID) },
        });

        const premiumTagId = process.env.SYSTEME_TRACKMYSPEND_PREMIUM_EN_TAG_ID;
        await axios.request({
          method: "POST",
          url: `https://api.systeme.io/api/contacts/${contactId}/tags`,
          headers: {
            "content-type": "application/json",
            "X-API-Key": apiKey,
          },
          data: { tagId: Number(premiumTagId) },
        });
      }
    } catch (error) {
      logSafeAxiosError("Systeme.io error in purchase-completed-en:", error);
    }

    return Response.json({ success: true });
  } catch (error) {
    logSafeAxiosError("Error in purchase-completed-en:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
