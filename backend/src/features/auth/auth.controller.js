import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./user.model.js";
import PendingUser from "./pending-user.model.js";
import { uploadImage, deleteImage } from "../../utils/image.js";
import { sendEmail } from "../../services/email.service.js";
import { welcomeMail, resetMail, otpMail } from "../../services/email.templates.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

const OTP_TTL_MS = 10 * 60 * 1000; // a code is valid for 10 minutes
const RESEND_WAIT_MS = 60 * 1000; // a new code can be requested once a minute
const MAX_ATTEMPTS = 5; // wrong codes allowed before the registration is cancelled

const normalizeEmail = (email) => String(email || "").toLowerCase().trim();
const createOtp = () => String(crypto.randomInt(100000, 1000000)); // 6 digits
const hashOtp = (otp) => crypto.createHmac("sha256", process.env.JWT_SECRET).update(otp).digest("hex");
const sameHash = (a, b) => a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));

const assertCanSendNewCode = (pending, res) => {
  const secondsLeft = Math.ceil((pending.otpSentAt.getTime() + RESEND_WAIT_MS - Date.now()) / 1000);
  if (secondsLeft > 0) {
    res.status(429);
    throw new Error(`Please wait ${secondsLeft}s before requesting a new code`);
  }
};

const emailCode = async (pending, otp, res) => {
  try {
    await sendEmail({ to: pending.email, ...otpMail(pending.name, otp) });
  } catch (error) {
    console.error("Verification email failed:", error.message);
    res.status(503);
    throw new Error("Could not send the verification email, please try again later");
  }
};

// Registration step 1: POST /api/auth/register (name, email, password)
// Nothing is created yet. We store a pending registration and email a 6-digit code.
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const candidate = new User({ name, email, password });
  await candidate.validate();

  if (await User.exists({ email: candidate.email })) {
    res.status(409);
    throw new Error("Email already exists");
  }

  const existing = await PendingUser.findOne({ email: candidate.email });
  if (existing) assertCanSendNewCode(existing, res);

  const otp = createOtp();
  const pending = await PendingUser.findOneAndUpdate(
    { email: candidate.email },
    {
      name: candidate.name,
      password: await bcrypt.hash(password, 10),
      otpHash: hashOtp(otp),
      otpSentAt: new Date(),
      attempts: 0,
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  try {
    await emailCode(pending, otp, res);
  } catch (error) {
    await pending.deleteOne(); // no email went out, so do not keep the registration
    throw error;
  }

  res.json({ message: "We sent a 6-digit code to your email", email: candidate.email });
};

// Registration step 2: POST /api/auth/verify-email (multipart: email, otp, image)
// Only now the account and the profile photo are created.
export const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const pending = await PendingUser.findOne({ email: normalizeEmail(req.body.email) });

  if (!pending || pending.expiresAt < new Date()) {
    res.status(400);
    throw new Error("The code has expired. Please register again.");
  }
  if (pending.attempts >= MAX_ATTEMPTS) {
    await pending.deleteOne();
    res.status(429);
    throw new Error("Too many wrong attempts. Please register again.");
  }
  if (!sameHash(hashOtp(String(otp || "")), pending.otpHash)) {
    pending.attempts += 1;
    await pending.save();
    res.status(400);
    throw new Error("Invalid verification code");
  }
  if (!req.file) {
    res.status(400);
    throw new Error("Profile photo is required");
  }

  const user = new User({ name: pending.name, email: pending.email, password: pending.password });
  user.$locals.passwordHashed = true; // the password was already hashed in step 1
  user.image = await uploadImage(req.file.buffer);
  try {
    await user.save();
  } catch (error) {
    await deleteImage(user.image.publicId);
    throw error;
  }
  await pending.deleteOne();

  // A failed email must not fail the registration
  sendEmail({ to: user.email, ...welcomeMail(user.name) }).catch((e) =>
    console.error("Welcome email failed:", e.message)
  );

  res.status(201).json({ message: "Account created. Please log in." });
};

// POST /api/auth/resend-otp (email)
export const resendOtp = async (req, res) => {
  const pending = await PendingUser.findOne({ email: normalizeEmail(req.body.email) });
  if (!pending) {
    res.status(400);
    throw new Error("Registration not found or expired. Please register again.");
  }
  assertCanSendNewCode(pending, res);

  const otp = createOtp();
  pending.set({
    otpHash: hashOtp(otp),
    otpSentAt: new Date(),
    attempts: 0,
    expiresAt: new Date(Date.now() + OTP_TTL_MS),
  });
  await pending.save();
  await emailCode(pending, otp, res);

  res.json({ message: "A new code has been sent to your email" });
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
