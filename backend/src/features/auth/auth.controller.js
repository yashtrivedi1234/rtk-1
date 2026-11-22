import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "./user.model.js";
import { uploadImage, deleteImage } from "../../utils/image.js";
import { sendEmail } from "../../services/email.service.js";
import { welcomeMail, resetMail } from "../../services/email.templates.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

// POST /api/auth/register (multipart: name, email, password, image)
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = new User({ name, email, password });

  try {
    await user.validate();
  } catch (error) {
    if (!req.file) error.errors = { ...error.errors, image: { message: "Profile photo is required" } };
    throw error;
  }
  if (!req.file) {
    res.status(400);
    throw new Error("Profile photo is required");
  }

  user.image = await uploadImage(req.file.buffer);
  try {
    await user.save();
  } catch (error) {
    await deleteImage(user.image.publicId);
    throw error;
  }

  // A failed email must not fail the registration
  sendEmail({ to: user.email, ...welcomeMail(user.name) }).catch((e) =>
    console.error("Welcome email failed:", e.message)
  );

  res.status(201).json({ message: "Registration successful. Please log in." });
};

// POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Enter both email and password");
  }

  const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({ token: signToken(user._id), user });
};

// POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: String(req.body.email || "").toLowerCase().trim() });

  if (user) {
    const token = user.createResetToken();
    await user.save({ validateBeforeSave: false });

    const link = `${process.env.CLIENT_URL}/reset-password/${token}`;
    try {
      await sendEmail({ to: user.email, ...resetMail(user.name, link) });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      console.error("Reset email failed:", error.message);
      throw new Error("Could not send the email, please try again later");
    }
  }

  // Same answer whether the email exists or not, so nobody can find out who is registered
  res.json({ message: "If this email is registered, a reset link has been sent." });
};

// POST /api/auth/reset-password/:token
export const resetPassword = async (req, res) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Reset link is invalid or has expired");
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ message: "Password updated. Please log in." });
};
