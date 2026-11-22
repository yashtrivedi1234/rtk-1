import { toast } from "react-toastify";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useGetStudentsQuery, useDeleteStudentMutation } from "../student.api";
import { getErrorMessage } from "../../../utils/toast";
import StudentCard from "../components/StudentCard";
import PageHeader from "../../../components/PageHeader";
import Skeleton from "../../../components/Skeleton";
import Message from "../../../components/Message";

// This page uses only the DELETE API. The list is only used to pick a student.
const DeleteStudent = () => {
  const { data: students = [], isLoading, error } = useGetStudentsQuery();
  const [deleteStudent] = useDeleteStudentMutation();

  const handleDelete = async (student) => {
    if (!window.confirm(`Delete ${student.name}? This cannot be undone.`)) return;

    try {
      await deleteStudent(student._id).unwrap();
      toast.success("Student deleted");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <PageHeader title="Delete student" subtitle="DELETE /api/students/:id" />

      {isLoading && <Skeleton />}
      {error && <Message error>Could not load students. Is the server running?</Message>}
      {!isLoading && !error && students.length === 0 && <Message>There are no students to delete.</Message>}

      <ul className="space-y-3">
        {students.map((s) => (
          <StudentCard key={s._id} student={s}>
            <button
              onClick={() => handleDelete(s)}
              className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-xl bg-danger-soft px-3 text-sm font-semibold text-red-700 transition-colors duration-200 hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
            >
              <TrashIcon className="h-5 w-5" aria-hidden="true" />
              <span className="hidden sm:inline">Delete</span>
              <span className="sr-only sm:hidden">Delete {s.name}</span>
            </button>
          </StudentCard>
        ))}
      </ul>
    </div>
  );
};

export default DeleteStudent;
