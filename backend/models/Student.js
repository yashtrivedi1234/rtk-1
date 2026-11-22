import mongoose from "mongoose";

// MODEL (M): database me data ka structure (schema)
const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    course: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
