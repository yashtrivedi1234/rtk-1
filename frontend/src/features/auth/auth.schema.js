import * as yup from "yup";
import { nameRegex, emailRegex, passwordRegex } from "../../utils/regex";
import { imageSchema } from "../../utils/imageSchema";

const email = yup
  .string()
  .trim()
  .required("Email is required")
  .matches(emailRegex, "Enter a valid email (e.g. abc@gmail.com)");

const password = yup
  .string()
  .required("Password is required")
  .matches(passwordRegex, "At least 8 characters with a letter and a number");

const confirmPassword = yup
  .string()
  .required("Please confirm your password")
  .oneOf([yup.ref("password")], "Passwords must match");

export const registerSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name is required")
    .min(2, "Name must be at least 2 letters")
    .matches(nameRegex, "Name can contain letters only"),
  email,
  password,
  confirmPassword,
  image: imageSchema("Profile photo is required"),
});

export const loginSchema = yup.object({
  email,
  password: yup.string().required("Password is required"),
});

export const forgotPasswordSchema = yup.object({ email });

export const resetPasswordSchema = yup.object({ password, confirmPassword });

export const otpSchema = yup.object({
  otp: yup
    .string()
    .trim()
    .required("Enter the 6-digit code")
    .matches(/^\d{6}$/, "The code must be 6 digits"),
});
