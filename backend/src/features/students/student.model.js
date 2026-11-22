import mongoose from "mongoose";
import { nameRegex, emailRegex, courseRegex } from "../../utils/regex.js";

const studentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 letters"],
      match: [nameRegex, "Name can contain letters only"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [emailRegex, "Enter a valid email (e.g. abc@gmail.com)"],
    },
    course: {
      type: String,
      required: [true, "Course is required"],
      trim: true,
      match: [courseRegex, "Course cannot contain special characters"],
    },
    image: {
      url: String,
      publicId: String,
    },
  },
  { timestamps: true }
);

// An email cannot repeat inside one user's list (different users may add the same email)
studentSchema.index({ user: 1, email: 1 }, { unique: true });

export default mongoose.model("Student", studentSchema);
