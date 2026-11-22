import Student from "../models/student.model.js";

// CONTROLLER (C): yaha business logic hota hai (database se kaam)
// try/catch nahi likha: Express 5 async error khud error middleware ko bhej deta hai.

// READ all -> GET /api/students
export const getStudents = async (req, res) => {
  const students = await Student.find().sort({ createdAt: -1 });
  res.json(students);
};

// CREATE -> POST /api/students
export const createStudent = async (req, res) => {
  const { name, email, course } = req.body;
  const student = await Student.create({ name, email, course });
  res.status(201).json(student);
};

// UPDATE -> PUT /api/students/:id
export const updateStudent = async (req, res) => {
  const { name, email, course } = req.body;
  const student = await Student.findByIdAndUpdate(
    req.params.id,
    { name, email, course },
    { new: true, runValidators: true }
  );
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }
  res.json(student);
};

// DELETE -> DELETE /api/students/:id
export const deleteStudent = async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }
  res.json({ message: "Student deleted" });
};
