import { Link } from "react-router-dom";
import { useGetStudentsQuery } from "../features/students/studentApi";
import StudentCard from "../features/students/StudentCard";
import Message from "../components/Message";

// PAGE 1: sirf GET API (useGetStudentsQuery)
const GetStudents = () => {
  // RTK Query ye teeno khud deta hai: data, isLoading, error
  const { data: students = [], isLoading, error } = useGetStudentsQuery();

  if (isLoading) return <Message>Loading...</Message>;
  if (error) return <Message error>Backend se data nahi aaya. Server chalu hai?</Message>;
  if (students.length === 0)
    return (
      <Message>
        Abhi koi student nahi hai. <Link to="/add" className="font-medium text-indigo-600 underline">Pehla student add karo</Link>
      </Message>
    );

  return (
    <ul className="space-y-3">
      {students.map((s) => (
        <StudentCard key={s._id} student={s} />
      ))}
    </ul>
  );
};

export default GetStudents;
