import { Router } from "express";
import { register, verifyEmail, resendOtp, login, forgotPassword, resetPassword } from "./auth.controller.js";
import upload from "../../middlewares/upload.middleware.js";
import { authLimiter } from "../../middlewares/rateLimit.middleware.js";

const router = Router();

router.use(authLimiter);
router.post("/register", register); // step 1: send the code
router.post("/verify-email", upload, verifyEmail); // step 2: verify the code and create the account
router.post("/resend-otp", resendOtp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
