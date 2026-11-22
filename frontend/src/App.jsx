import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import { ProtectedRoute, GuestRoute } from "./features/auth/components/RouteGuards";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import ForgotPassword from "./features/auth/pages/ForgotPassword";
import ResetPassword from "./features/auth/pages/ResetPassword";
import Dashboard from "./features/dashboard/pages/Dashboard";
import GetStudents from "./features/students/pages/GetStudents";
import AddStudent from "./features/students/pages/AddStudent";
import UpdateStudent from "./features/students/pages/UpdateStudent";
import DeleteStudent from "./features/students/pages/DeleteStudent";

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<GetStudents />} />
            <Route path="/students/add" element={<AddStudent />} />
            <Route path="/students/update" element={<UpdateStudent />} />
            <Route path="/students/delete" element={<DeleteStudent />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} newestOnTop pauseOnHover theme="light" />
    </>
  );
};

export default App;
