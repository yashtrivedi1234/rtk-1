import Student from "./student.model.js";
import { uploadImage, deleteImage } from "../../utils/image.js";

// No try/catch needed: Express 5 forwards async errors to the error middleware.
// Every query filters by user: req.user._id, so a user can only touch their own students.

export const getStudents = async (req, res) => {
  const students = await Student.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(students);
};

export const createStudent = async (req, res) => {
  const { name, email, course } = req.body;
  const student = new Student({ name, email, course, user: req.user._id });
  if (req.file) student.image = await uploadImage(req.file.buffer);

  try {
    await student.save();
  } catch (error) {
    await deleteImage(student.image?.publicId);
    throw error;
  }
  res.status(201).json(student);
};

export const updateStudent = async (req, res) => {
  const student = await Student.findOne({ _id: req.params.id, user: req.user._id });
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  const { name, email, course } = req.body;
  const oldPublicId = student.image?.publicId;
  student.set({ name, email, course });

  if (req.file) student.image = await uploadImage(req.file.buffer);

  try {
    await student.save();
  } catch (error) {
    if (req.file) await deleteImage(student.image.publicId);
    throw error;
  }

  if (req.file) await deleteImage(oldPublicId);
  res.json(student);
};

export const deleteStudent = async (req, res) => {
  const student = await Student.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }
  await deleteImage(student.image?.publicId);
  res.json({ message: "Student deleted" });
};
