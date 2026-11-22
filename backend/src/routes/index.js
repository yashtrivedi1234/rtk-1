import { Router } from "express";
import studentRoutes from "./student.routes.js";

// Saare routes yaha ek jagah jude hote hain. Naya module aaye to bas ek line add karo.
const router = Router();

router.use("/students", studentRoutes);

export default router;
