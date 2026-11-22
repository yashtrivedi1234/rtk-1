import { Outlet } from "react-router-dom";
import { AcademicCapIcon } from "@heroicons/react/24/outline";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
            <AcademicCapIcon className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="text-2xl font-bold">Student CRUD</h1>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
