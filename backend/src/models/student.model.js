import mongoose from "mongoose";

// Regex frontend (yup) wale hi hain, taaki dono jagah same rule lage
const nameRegex = /^[A-Za-z ]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
const courseRegex = /^[A-Za-z0-9 .+#-]+$/;

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name zaroori hai"],
      trim: true,
      minlength: [2, "Name kam se kam 2 letters ka ho"],
      match: [nameRegex, "Name me sirf letters allowed hain"],
    },
    email: {
      type: String,
      required: [true, "Email zaroori hai"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [emailRegex, "Sahi email daalo (jaise abc@gmail.com)"],
    },
    course: {
      type: String,
      required: [true, "Course zaroori hai"],
      trim: true,
      match: [courseRegex, "Course me special characters allowed nahi hain"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
