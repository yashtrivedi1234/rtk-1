import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import GetStudents from "./pages/GetStudents";
import AddStudent from "./pages/AddStudent";
import UpdateStudent from "./pages/UpdateStudent";
import DeleteStudent from "./pages/DeleteStudent";

const links = [
  { to: "/", label: "List", method: "GET" },
  { to: "/add", label: "Add", method: "POST" },
  { to: "/update", label: "Update", method: "PUT" },
  { to: "/delete", label: "Delete", method: "DELETE" },
];

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold text-slate-800">Student CRUD</h1>
          <p className="mb-6 text-slate-500">MERN + RTK Query</p>

          {/* Navbar: har link ek alag page kholta hai */}
          <nav className="mb-6 grid grid-cols-4 gap-2 rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-slate-200">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `rounded-lg py-2 text-center text-sm font-medium transition ${
                    isActive ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                {l.label}
                <span className="block text-[10px] font-normal opacity-70">{l.method}</span>
              </NavLink>
            ))}
          </nav>

          {/* URL ke hisaab se ek page dikhta hai */}
          <Routes>
            <Route path="/" element={<GetStudents />} />
            <Route path="/add" element={<AddStudent />} />
            <Route path="/update" element={<UpdateStudent />} />
            <Route path="/delete" element={<DeleteStudent />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
