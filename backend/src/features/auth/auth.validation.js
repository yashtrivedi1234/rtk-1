import * as yup from "yup";
import { nameRegex, emailRegex, passwordRegex } from "../../utils/regex.js";
import { imageSchema } from "../../utils/imageSchema.js";

const name = yup
  .string()
  .trim()
  .required("Name is required")
  .min(2, "Name must be at least 2 letters")
  .matches(nameRegex, "Name can contain letters only");

const email = yup
  .string()
  .trim()
  .lowercase()
  .required("Email is required")
  .matches(emailRegex, "Enter a valid email (e.g. abc@gmail.com)");

const password = yup
  .string()
  .required("Password is required")
  .matches(passwordRegex, "Password must be at least 8 characters with a letter and a number");

// POST /api/auth/register
export const registerSchema = yup.object({ name, email, password });

// POST /api/auth/verify-email (multipart, so the profile photo is validated here too)
export const verifyEmailSchema = yup.object({
  email,
  otp: yup
    .string()
    .trim()
    .required("Enter the 6-digit code")
    .matches(/^\d{6}$/, "The code must be 6 digits"),
  image: imageSchema("Profile photo is required"),
});

// POST /api/auth/resend-otp and /api/auth/forgot-password
export const emailSchema = yup.object({ email });

// POST /api/auth/login (no password rules here, old accounts must still be able to log in)
export const loginSchema = yup.object({
  email: yup.string().trim().lowercase().required("Email is required"),
  password: yup.string().required("Password is required"),
});

// POST /api/auth/reset-password/:token
export const resetPasswordSchema = yup.object({ password });

// The token in the link is "<userId>.<randomToken>"
export const resetTokenParamsSchema = yup.object({
  token: yup.string().matches(/^[a-f\d]{24}\.[A-Za-z0-9]{20,}$/, "Reset link is invalid or has expired"),
});
