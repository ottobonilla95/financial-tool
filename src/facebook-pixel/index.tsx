"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";
import * as pixel from "./fpixel";
import { v4 as uuidv4 } from "uuid";

const FacebookPixel = () => {
  const [loaded, setLoaded] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!loaded) return;

    const eventId = uuidv4(); // Generate a unique event ID

    // Send PageView event to Meta Pixel (browser)
    pixel.pageview(eventId);

    // Send PageView event to Conversions API (server)
    fetch("/api/meta-events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName: "PageView",
        eventId, // Use the same event ID
        eventSourceUrl: window.location.href,
      }),
    });
  }, [pathname, loaded]);
  return (
    <div>
      <Script
        id="fb-pixel"
        src="/scripts/pixel.js"
        strategy="afterInteractive"
        onLoad={() => setLoaded(true)}
        data-pixel-id={pixel.FB_PIXEL_ID}
      />
    </div>
  );
};

export default FacebookPixel;
