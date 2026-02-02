import { resend, EMAIL_CONFIG } from "./resend-client";
import { getWelcomeEmailTemplate } from "./templates/welcome-email";

type SendWelcomeEmailParams = {
  to: string;
  name: string;
  lang: "en" | "es";
};

type SendWelcomeEmailResult = {
  success: boolean;
  error?: string;
};

export async function sendWelcomeEmail({
  to,
  name,
  lang,
}: SendWelcomeEmailParams): Promise<SendWelcomeEmailResult> {
  try {
    const { subject, html } = getWelcomeEmailTemplate({ name, lang });

    const { error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to,
      subject,
      html,
      replyTo: EMAIL_CONFIG.replyTo,
    });

    if (error) {
      console.error("Resend error sending welcome email:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
