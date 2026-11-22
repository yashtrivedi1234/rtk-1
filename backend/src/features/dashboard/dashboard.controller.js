import Student from "../students/student.model.js";

// GET /api/dashboard: summary of the logged-in user's students
export const getDashboard = async (req, res) => {
  const user = req.user._id;

  const [totalStudents, courses, recentStudents] = await Promise.all([
    Student.countDocuments({ user }),
    Student.aggregate([
      { $match: { user } },
      { $group: { _id: { $toLower: "$course" }, name: { $first: "$course" }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Student.find({ user }).sort({ createdAt: -1 }).limit(5),
  ]);

  res.json({
    totalStudents,
    totalCourses: courses.length,
    topCourses: courses.slice(0, 5).map(({ name, count }) => ({ name, count })),
    recentStudents,
  });
};
