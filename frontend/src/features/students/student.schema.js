import * as yup from "yup";
import { nameRegex, emailRegex, courseRegex } from "../../utils/regex";
import { imageSchema } from "../../utils/imageSchema";

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
    .required("Email is required")
    .matches(emailRegex, "Enter a valid email (e.g. abc@gmail.com)"),
  course: yup
    .string()
    .trim()
    .required("Course is required")
    .matches(courseRegex, "Course cannot contain special characters"),
  image: imageSchema(),
});

export const emptyStudent = { name: "", email: "", course: "" };
