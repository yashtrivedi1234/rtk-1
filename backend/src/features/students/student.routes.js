import { Router } from "express";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "./student.controller.js";
import { studentSchema, studentIdParamsSchema } from "./student.validation.js";
import upload from "../../middlewares/upload.middleware.js";
import { validate, validateParams } from "../../middlewares/validate.middleware.js";

const router = Router();

router.get("/", getStudents);
router.post("/", upload, validate(studentSchema), createStudent);
router.put("/:id", validateParams(studentIdParamsSchema), upload, validate(studentSchema), updateStudent);
router.delete("/:id", validateParams(studentIdParamsSchema), deleteStudent);

export default router;
