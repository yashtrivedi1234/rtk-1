import { useNavigate } from "react-router-dom";
import StudentForm from "../features/students/StudentForm";

const AddStudent = () => {
  const navigate = useNavigate();

  return <StudentForm onDone={() => navigate("/")} />;
};

export default AddStudent;
