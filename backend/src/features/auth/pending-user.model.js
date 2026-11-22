import mongoose from "mongoose";

// A registration that is waiting for email verification. The real User is created only after the code is verified.
// MongoDB deletes the document by itself when expiresAt passes (TTL index).
const pendingUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // already hashed with bcrypt
  otpHash: { type: String, required: true }, // only the hash of the code is stored
  otpSentAt: { type: Date, default: Date.now },
  attempts: { type: Number, default: 0 }, // wrong codes entered so far
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
});

export default mongoose.model("PendingUser", pendingUserSchema);
