import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // Input rules live in Yup (student.validation.js). The schema only describes how data is stored.
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    course: { type: String, required: true, trim: true },
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
