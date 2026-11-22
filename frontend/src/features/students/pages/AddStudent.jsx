import { useNavigate } from "react-router-dom";
import StudentForm from "../components/StudentForm";
import PageHeader from "../../../components/PageHeader";

// This page uses only the POST API (inside the form)
const AddStudent = () => {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader title="Add student" subtitle="POST /api/students" />
      <StudentForm onDone={() => navigate("/students")} />
    </div>
  );
};

export default AddStudent;
