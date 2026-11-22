import { Router } from "express";
import { register, login, forgotPassword, resetPassword } from "./auth.controller.js";
import upload from "../../middlewares/upload.middleware.js";
import { authLimiter } from "../../middlewares/rateLimit.middleware.js";

const router = Router();

router.use(authLimiter);
router.post("/register", upload, register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
