import { transporter } from "../config/mailer.js";

export const sendEmail = async ({ to, subject, text, html }) => {
  // Mailer is not connected: in development the email is printed in the terminal
  if (!transporter) {
    if (process.env.NODE_ENV === "production") throw new Error("Mail service is not configured");
    console.log(`\n[DEV EMAIL] To: ${to}\nSubject: ${subject}\n${text}\n`);
    return;
  }

  await transporter.sendMail({ from: process.env.EMAIL_FROM, to, subject, text, html });
};
