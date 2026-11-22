import Student from "../models/Student.js";

// CONTROLLER (C): yaha business logic hota hai (database se kaam)

// READ all  -> GET /api/students
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE  -> POST /api/students
export const createStudent = async (req, res) => {
  try {
    const { name, email, course } = req.body;
    const student = await Student.create({ name, email, course });
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE  -> PUT /api/students/:id
export const updateStudent = async (req, res) => {
  try {
    const { name, email, course } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, email, course },
      { new: true, runValidators: true }
    );
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE  -> DELETE /api/students/:id
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
