import { useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useGetStudentsQuery } from "../student.api";
import StudentForm from "../components/StudentForm";
import StudentCard from "../components/StudentCard";
import PageHeader from "../../../components/PageHeader";
import Skeleton from "../../../components/Skeleton";
import Message from "../../../components/Message";

// This page uses only the PUT API (inside the form). The list is only used to pick a student.
const UpdateStudent = () => {
  const { data: students = [], isLoading, error } = useGetStudentsQuery();
  const [editing, setEditing] = useState(null);

  const handleEdit = (student) => {
    setEditing(student);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <PageHeader title="Update student" subtitle="PUT /api/students/:id" />

      {editing && (
        <div className="mb-6">
          {/* A new key creates a fresh form, so the fields fill with the chosen student */}
          <StudentForm key={editing._id} editing={editing} onDone={() => setEditing(null)} />
        </div>
      )}

      {isLoading && <Skeleton />}
      {error && <Message error>Could not load students. Is the server running?</Message>}
      {!isLoading && !error && students.length === 0 && <Message>There are no students to edit.</Message>}

      <ul className="space-y-3">
        {students.map((s) => (
          <StudentCard key={s._id} student={s} active={editing?._id === s._id}>
            <button
              onClick={() => handleEdit(s)}
              className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-xl bg-primary-soft px-3 text-sm font-semibold text-primary transition-colors duration-200 hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
              <span className="hidden sm:inline">Edit</span>
              <span className="sr-only sm:hidden">Edit {s.name}</span>
            </button>
          </StudentCard>
        ))}
      </ul>
    </div>
  );
};

export default UpdateStudent;
