import { useState } from "react";
import StudentForm from "../components/StudentForm";
import StudentCard from "../components/StudentCard";
import Message from "../components/Message";
import { useGetStudentsQuery } from "../services/studentApi";

// PAGE 3: sirf PUT API (form ke andar useUpdateStudentMutation chalta hai)
// Student chunne ke liye list dikhane ko GET hook bhi use hua hai
const UpdateStudent = () => {
  const { data: students = [], isLoading, error } = useGetStudentsQuery();
  const [editing, setEditing] = useState(null);

  if (isLoading) return <Message>Loading...</Message>;
  if (error) return <Message error>Backend se data nahi aaya. Server chalu hai?</Message>;

  return (
    <div className="space-y-6">
      {editing && (
        // key badalne par form naya ban jata hai, isliye data sahi bharta hai
        <StudentForm key={editing._id} editing={editing} onDone={() => setEditing(null)} />
      )}

      {students.length === 0 && <Message>Edit karne ke liye koi student nahi hai.</Message>}

      <ul className="space-y-3">
        {students.map((s) => (
          <StudentCard key={s._id} student={s}>
            <button onClick={() => setEditing(s)} className="rounded-lg bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-700 hover:bg-amber-200">
              Edit
            </button>
          </StudentCard>
        ))}
      </ul>
    </div>
  );
};

export default UpdateStudent;
