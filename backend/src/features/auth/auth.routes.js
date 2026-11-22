import { Router } from "express";
import { register, verifyEmail, resendOtp, login, forgotPassword, resetPassword } from "./auth.controller.js";
import {
  registerSchema,
  verifyEmailSchema,
  emailSchema,
  loginSchema,
  resetPasswordSchema,
  resetTokenParamsSchema,
} from "./auth.validation.js";
import upload from "../../middlewares/upload.middleware.js";
import { validate, validateParams } from "../../middlewares/validate.middleware.js";
import { authLimiter } from "../../middlewares/rateLimit.middleware.js";

const router = Router();

router.use(authLimiter);
router.post("/register", validate(registerSchema), register); // step 1: send the code
router.post("/verify-email", upload, validate(verifyEmailSchema), verifyEmail); // step 2: verify and create the account
router.post("/resend-otp", validate(emailSchema), resendOtp);
router.post("/login", validate(loginSchema), login);
router.post("/forgot-password", validate(emailSchema), forgotPassword);
router.post("/reset-password/:token", validateParams(resetTokenParamsSchema), validate(resetPasswordSchema), resetPassword);

export default router;
