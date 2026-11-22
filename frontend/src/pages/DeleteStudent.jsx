import { useGetStudentsQuery, useDeleteStudentMutation } from "../features/students/student.api";
import StudentCard from "../features/students/StudentCard";
import Message from "../components/Message";

const DeleteStudent = () => {
  const { data: students = [], isLoading, error } = useGetStudentsQuery();
  const [deleteStudent] = useDeleteStudentMutation();

  const handleDelete = (student) => {
    if (window.confirm(`${student.name} ko delete karna hai?`)) deleteStudent(student._id);
  };

  if (isLoading) return <Message>Loading...</Message>;
  if (error) return <Message error>Backend se data nahi aaya. Server chalu hai?</Message>;
  if (students.length === 0) return <Message>Delete karne ke liye koi student nahi hai.</Message>;

  return (
    <ul className="space-y-3">
      {students.map((s) => (
        <StudentCard key={s._id} student={s}>
          <button onClick={() => handleDelete(s)} className="rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200">
            Delete
          </button>
        </StudentCard>
      ))}
    </ul>
  );
};

export default DeleteStudent;
