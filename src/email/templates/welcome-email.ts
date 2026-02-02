type WelcomeEmailProps = {
  name: string;
  lang: "en" | "es";
};

const translations = {
  en: {
    subject: "Welcome to TrackMySpend!",
    greeting: "Hello",
    welcomeMessage:
      "Thank you for purchasing TrackMySpend! Your lifetime access is now active.",
    appDescription:
      "TrackMySpend is a web application that works on any device - computer, tablet, or phone. No app download needed!",
    loginTitle: "Access Your Account",
    loginButton: "Log In to TrackMySpend",
    passwordTitle: "Your Temporary Password",
    passwordReminder:
      "Please change your password after your first login for security.",
    supportTitle: "Need Help?",
    supportMessage: "If you have any questions, contact us at",
    footer: "Thank you for choosing TrackMySpend!",
  },
  es: {
    subject: "Bienvenido a TrackMySpend!",
    greeting: "Hola",
    welcomeMessage:
      "Gracias por comprar TrackMySpend! Tu acceso de por vida ya esta activo.",
    appDescription:
      "TrackMySpend es una aplicacion web que funciona en cualquier dispositivo - computadora, tablet o telefono. No necesitas descargar ninguna app!",
    loginTitle: "Accede a Tu Cuenta",
    loginButton: "Iniciar Sesion en TrackMySpend",
    passwordTitle: "Tu Contrasena Temporal",
    passwordReminder:
      "Por favor cambia tu contrasena despues de tu primer inicio de sesion por seguridad.",
    supportTitle: "Necesitas Ayuda?",
    supportMessage: "Si tienes alguna pregunta, contactanos en",
    footer: "Gracias por elegir TrackMySpend!",
  },
};

const DEFAULT_PASSWORD = "Trackmyspend.24!";

export function getWelcomeEmailTemplate({ name, lang }: WelcomeEmailProps): {
  subject: string;
  html: string;
} {
  const t = translations[lang];
  const loginUrl = `https://trackmyspend.co/${lang}/login?variant=signup_finished`;

  const html = `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 20px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color: #000000; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">TrackMySpend</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <!-- Greeting -->
              <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">
                ${t.greeting} ${name}!
              </h2>

              <!-- Welcome Message -->
              <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                ${t.welcomeMessage}
              </p>

              <!-- App Description -->
              <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                ${t.appDescription}
              </p>

              <!-- Login Section -->
              <table role="presentation" style="width: 100%; margin-bottom: 30px;">
                <tr>
                  <td style="text-align: center;">
                    <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px;">
                      ${t.loginTitle}
                    </h3>
                    <a href="${loginUrl}"
                       style="display: inline-block; background-color: #1cde98; color: #000000; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                      ${t.loginButton}
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Password Box -->
              <table role="presentation" style="width: 100%; margin-bottom: 30px;">
                <tr>
                  <td style="background-color: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 8px; padding: 20px; text-align: center;">
                    <h3 style="color: #333333; margin: 0 0 10px 0; font-size: 18px;">
                      ${t.passwordTitle}
                    </h3>
                    <p style="font-family: monospace; font-size: 20px; color: #000000; background-color: #ffffff; padding: 10px 20px; border-radius: 4px; display: inline-block; margin: 0 0 10px 0; border: 1px solid #dee2e6;">
                      ${DEFAULT_PASSWORD}
                    </p>
                    <p style="color: #6c757d; font-size: 14px; margin: 0;">
                      ${t.passwordReminder}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Support Section -->
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td style="border-top: 1px solid #dee2e6; padding-top: 20px;">
                    <h4 style="color: #333333; margin: 0 0 10px 0; font-size: 16px;">
                      ${t.supportTitle}
                    </h4>
                    <p style="color: #555555; font-size: 14px; margin: 0;">
                      ${t.supportMessage} <a href="mailto:support@trackmyspend.co" style="color: #1cde98;">support@trackmyspend.co</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center;">
              <p style="color: #6c757d; font-size: 14px; margin: 0;">
                ${t.footer}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  return {
    subject: t.subject,
    html,
  };
}
