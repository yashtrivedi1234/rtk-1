import nodemailer from "nodemailer";

const keys = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "EMAIL_FROM"];

// Set by connectMailer(). It stays null when the SMTP env variables are missing.
export let transporter = null;

export const connectMailer = async () => {
  const missing = keys.filter((key) => !process.env[key]);
  if (missing.length) {
    console.warn(`⚠️  Mailer not configured. Missing env: ${missing.join(", ")} (emails will not be sent)`);
    return false;
  }

  const port = Number(process.env.SMTP_PORT);
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  try {
    await transporter.verify();
    console.log(`✅ Mailer connected (${process.env.SMTP_HOST})`);
    return true;
  } catch (error) {
    console.error(`❌ Mailer connection failed: ${error.message || error.code}`);
    return false;
  }
};
