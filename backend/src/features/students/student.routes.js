import { Router } from "express";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "./student.controller.js";
import upload from "../../middlewares/upload.middleware.js";

const router = Router();

router.get("/", getStudents);
router.post("/", upload, createStudent);
router.put("/:id", upload, updateStudent);
router.delete("/:id", deleteStudent);

export default router;
