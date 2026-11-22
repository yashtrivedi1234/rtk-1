import { Link } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useGetStudentsQuery } from "../student.api";
import StudentCard from "../components/StudentCard";
import PageHeader from "../../../components/PageHeader";
import Skeleton from "../../../components/Skeleton";
import Message from "../../../components/Message";

const addButtonClass =
  "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-primary px-4 font-semibold text-white transition-colors duration-200 hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

// This page uses only the GET API
const GetStudents = () => {
  const { data: students = [], isLoading, error } = useGetStudentsQuery();

  return (
    <div>
      <PageHeader
        title="All students"
        subtitle="GET /api/students"
        action={
          <Link to="/students/add" className={addButtonClass}>
            <PlusIcon className="h-5 w-5" aria-hidden="true" />
            Add
          </Link>
        }
      />

      {isLoading && <Skeleton />}
      {error && <Message error>Could not load students. Is the server running?</Message>}
      {!isLoading && !error && students.length === 0 && (
        <Message>
          <p className="mb-4">No students yet.</p>
          <Link to="/students/add" className={addButtonClass}>Add your first student</Link>
        </Message>
      )}

      <ul className="space-y-3">
        {students.map((s) => (
          <StudentCard key={s._id} student={s} />
        ))}
      </ul>
    </div>
  );
};

export default GetStudents;
