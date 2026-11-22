import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { randomToken } from "../../utils/random.js";

const userSchema = new mongoose.Schema(
  {
    // Input rules live in Yup (auth.validation.js). The schema only describes how data is stored.
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    password: { type: String, required: true, select: false }, // always a bcrypt hash, never returned by queries

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

userSchema.methods.matchPassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

// The email gets "<userId>.<randomToken>", the database only keeps the bcrypt hash of the random part
// (a leaked database cannot be used to reset passwords)
userSchema.methods.createResetToken = async function () {
  const token = await randomToken();
  this.resetPasswordToken = await bcrypt.hash(token, 10);
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return `${this._id}.${token}`;
};

export default mongoose.model("User", userSchema);
