import * as yup from "yup";
import { nameRegex, emailRegex, passwordRegex } from "../../utils/regex";

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
  image: yup
    .mixed()
    .test("required", "Profile photo is required", (files) => files?.length > 0)
    .test("type", "Please choose an image file", (files) => !files?.[0] || files[0].type.startsWith("image/"))
    .test("size", "Image must be smaller than 2MB", (files) => !files?.[0] || files[0].size <= 2 * 1024 * 1024),
});

export const loginSchema = yup.object({
  email,
  password: yup.string().required("Password is required"),
});

export const forgotPasswordSchema = yup.object({ email });

export const resetPasswordSchema = yup.object({ password, confirmPassword });
