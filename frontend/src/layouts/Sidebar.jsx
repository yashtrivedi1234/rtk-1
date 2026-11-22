import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  AcademicCapIcon,
  ArrowRightOnRectangleIcon,
  ListBulletIcon,
  PencilSquareIcon,
  Squares2X2Icon,
  TrashIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { logout } from "../features/auth/authSlice";
import Avatar from "../components/Avatar";

const studentLinks = [
  { to: "/students", label: "All students", method: "GET", icon: ListBulletIcon },
  { to: "/students/add", label: "Add student", method: "POST", icon: UserPlusIcon },
  { to: "/students/update", label: "Update student", method: "PUT", icon: PencilSquareIcon },
  { to: "/students/delete", label: "Delete student", method: "DELETE", icon: TrashIcon },
];

const NavItem = ({ to, label, method, icon: Icon, onNavigate }) => (
  <NavLink
    to={to}
    end
    onClick={onNavigate}
    className={({ isActive }) =>
      `flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        isActive ? "bg-primary text-white" : "text-subtle hover:bg-primary-soft hover:text-primary"
      }`
    }
  >
    <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
    <span className="flex-1">{label}</span>
    {method && <span className="text-[10px] font-medium opacity-70">{method}</span>}
  </NavLink>
);

const Sidebar = ({ open, onNavigate }) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    toast.info("You have been logged out");
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-surface transition-[transform,visibility] duration-200 motion-reduce:transition-none lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:visible lg:translate-x-0 ${
        open ? "translate-x-0" : "invisible -translate-x-full"
      }`}
    >
      <div className="flex items-center gap-3 px-5 py-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
          <AcademicCapIcon className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <p className="font-bold leading-tight">Student CRUD</p>
          <p className="text-xs text-subtle">MERN + RTK Query</p>
        </div>
      </div>

      <nav aria-label="Main" className="flex-1 space-y-1 overflow-y-auto px-3">
        <NavItem to="/dashboard" label="Dashboard" icon={Squares2X2Icon} onNavigate={onNavigate} />
        <p className="px-3 pb-1 pt-5 text-xs font-semibold uppercase tracking-wide text-subtle">Students</p>
        {studentLinks.map((link) => (
          <NavItem key={link.to} {...link} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="border-t border-line p-3">
        <div className="flex items-center gap-3 rounded-xl p-2">
          <Avatar name={user?.name} url={user?.image?.url} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user?.name}</p>
            <p className="truncate text-xs text-subtle">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-1 flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-3 text-sm font-semibold text-red-700 transition-colors duration-200 hover:bg-danger-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" aria-hidden="true" />
          Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
