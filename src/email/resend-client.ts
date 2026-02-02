import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const EMAIL_CONFIG = {
  from: "TrackMySpend <noreply@trackmyspend.co>",
  replyTo: "support@trackmyspend.co",
};
