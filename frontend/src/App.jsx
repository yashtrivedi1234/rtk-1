import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import GetStudents from "./pages/GetStudents";
import AddStudent from "./pages/AddStudent";
import UpdateStudent from "./pages/UpdateStudent";
import DeleteStudent from "./pages/DeleteStudent";

// App.jsx me sirf routes: URL -> page
const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<GetStudents />} />
        <Route path="/add" element={<AddStudent />} />
        <Route path="/update" element={<UpdateStudent />} />
        <Route path="/delete" element={<DeleteStudent />} />
      </Route>
    </Routes>
  );
};

export default App;
