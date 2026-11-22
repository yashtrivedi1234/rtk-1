import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { nameRegex, emailRegex, passwordRegex } from "../../utils/regex.js";
import { randomToken } from "../../utils/random.js";

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
  const alreadyHashed = this.$locals.passwordHashed; // set when the password was hashed in registration step 1
  if (this.isModified("password") && !alreadyHashed) this.password = await bcrypt.hash(this.password, 10);
});

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
