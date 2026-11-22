import { useNavigate } from "react-router-dom";
import StudentForm from "../features/students/StudentForm";

// PAGE 2: sirf POST API (form ke andar useAddStudentMutation chalta hai)
const AddStudent = () => {
  const navigate = useNavigate();

  // Student add hone ke baad list page par bhej do
  return <StudentForm onDone={() => navigate("/")} />;
};

export default AddStudent;
