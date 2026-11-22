import * as yup from "yup";

const nameRegex = /^[A-Za-z ]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
const courseRegex = /^[A-Za-z0-9 .+#-]+$/;

export const studentSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name zaroori hai")
    .min(2, "Name kam se kam 2 letters ka ho")
    .matches(nameRegex, "Name me sirf letters allowed hain"),
  email: yup
    .string()
    .trim()
    .required("Email zaroori hai")
    .matches(emailRegex, "Sahi email daalo (jaise abc@gmail.com)"),
  course: yup
    .string()
    .trim()
    .required("Course zaroori hai")
    .matches(courseRegex, "Course me special characters allowed nahi hain"),
});

export const emptyStudent = { name: "", email: "", course: "" };
