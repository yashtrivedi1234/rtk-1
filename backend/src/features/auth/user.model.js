import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { nameRegex, emailRegex, passwordRegex } from "../../utils/regex.js";

const userSchema = new mongoose.Schema(
  {
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
      unique: true,
      match: [emailRegex, "Enter a valid email (e.g. abc@gmail.com)"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      match: [passwordRegex, "Password must be at least 8 characters with a letter and a number"],
      select: false, // the password is not returned by queries unless asked for
    },
    image: {
      url: String,
      publicId: String,
    },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: { type: Date, select: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpire;
        return ret;
      },
    },
  }
);

// Validation (regex) runs on the plain password first, then it is hashed
userSchema.pre("save", async function () {
  if (this.isModified("password")) this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

// The email gets the real token, the database only keeps its hash (a leaked DB cannot be used to reset passwords)
userSchema.methods.createResetToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return token;
};

export default mongoose.model("User", userSchema);
