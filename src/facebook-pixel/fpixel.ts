// @ts-nocheck

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

export const pageview = (eventID: string) => {
  window?.fbq?.("track", "PageView", {}, { eventID }); // Pass event ID for deduplication
};

export const event = (name: string, options = {}, eventID?: string) => {
  window?.fbq?.("track", name, options, eventID ? { eventID } : {});
};
