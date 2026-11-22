import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// Not logged in: go to the login page
export const ProtectedRoute = () => {
  const token = useSelector((state) => state.auth.token);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

// Already logged in: no need to see login / register again
export const GuestRoute = () => {
  const token = useSelector((state) => state.auth.token);
  return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
};
