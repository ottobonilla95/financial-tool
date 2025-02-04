import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { eventName, eventId, eventSourceUrl } = await req.json();

    // Extract client IP address from request headers
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0] || req.ip || null;

    // Extract User-Agent
    const clientUserAgent = req.headers.get("user-agent") || null;

    // Construct the payload
    const payload = {
      data: [
        {
          event_name: eventName || "ViewContent",
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_id: eventId, // Use the same event ID received from the client
          event_source_url: eventSourceUrl || "http",
          user_data: {
            client_ip_address: clientIp,
            client_user_agent: clientUserAgent,
          },
        },
      ],
    };

    console.log("meta", JSON.stringify(payload));
    // Send event to Meta's Conversions API
    const response = await fetch(
      `https://graph.facebook.com/v22.0/${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}/events?access_token=${process.env.NEXT_PUBLIC_FACEBOOK_ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Meta API Error:", error);
    return NextResponse.json(
      { error: "Failed to send event" },
      { status: 500 }
    );
  }
}
