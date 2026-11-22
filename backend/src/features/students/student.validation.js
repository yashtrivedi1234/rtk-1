import * as yup from "yup";
import { nameRegex, emailRegex, courseRegex } from "../../utils/regex.js";
import { imageSchema } from "../../utils/imageSchema.js";

// POST /api/students and PUT /api/students/:id (the photo is optional)
export const studentSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name is required")
    .min(2, "Name must be at least 2 letters")
    .matches(nameRegex, "Name can contain letters only"),
  email: yup
    .string()
    .trim()
    .lowercase()
    .required("Email is required")
    .matches(emailRegex, "Enter a valid email (e.g. abc@gmail.com)"),
  course: yup
    .string()
    .trim()
    .required("Course is required")
    .matches(courseRegex, "Course cannot contain special characters"),
  image: imageSchema(),
});

// /api/students/:id
export const studentIdParamsSchema = yup.object({
  id: yup.string().matches(/^[a-f\d]{24}$/i, "Invalid id"),
});
