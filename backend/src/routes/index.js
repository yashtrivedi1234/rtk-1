import { Router } from "express";
import authRoutes from "../features/auth/auth.routes.js";
import studentRoutes from "../features/students/student.routes.js";
import dashboardRoutes from "../features/dashboard/dashboard.routes.js";
import { protect } from "../features/auth/auth.middleware.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/students", protect, studentRoutes); // login required
router.use("/dashboard", protect, dashboardRoutes); // login required

export default router;
