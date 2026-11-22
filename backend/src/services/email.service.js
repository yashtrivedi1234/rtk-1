import { transporter } from "../config/mailer.js";

export const sendEmail = async ({ to, subject, text, html }) => {
  if (!transporter) throw new Error("Mail service is not configured");

  await transporter.sendMail({ from: process.env.EMAIL_FROM, to, subject, text, html });
};
