import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { AcademicCapIcon, Bars3Icon } from "@heroicons/react/24/outline";
import Sidebar from "./Sidebar";

// Sidebar on the left (a slide-in menu on mobile) and the current page on the right
const DashboardLayout = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <div className="min-h-screen lg:flex">
      {open && (
        <div className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={() => setOpen(false)} aria-hidden="true" />
      )}
      <Sidebar open={open} onNavigate={() => setOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-line bg-surface px-4 py-3 lg:hidden">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl text-primary transition-colors duration-200 hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
            <AcademicCapIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="font-bold">Student CRUD</p>
        </header>

        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
