import * as yup from "yup";
import { nameRegex, emailRegex, courseRegex } from "../../utils/regex";

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
  image: yup
    .mixed()
    .test("type", "Please choose an image file", (files) => !files?.[0] || files[0].type.startsWith("image/"))
    .test("size", "Image must be smaller than 2MB", (files) => !files?.[0] || files[0].size <= 2 * 1024 * 1024),
});

export const emptyStudent = { name: "", email: "", course: "" };
