// Ek student ki card. Buttons ko children ke roop me bahar se milte hain,
// isliye Get / Update / Delete teeno pages isi ko use karte hain.
const StudentCard = ({ student, children }) => {
  return (
    <li className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-600">
        {student.name[0].toUpperCase()}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-slate-800">{student.name}</p>
        <p className="truncate text-sm text-slate-500">{student.email}</p>
      </div>

      <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 sm:block">
        {student.course}
      </span>

      {children}
    </li>
  );
};

export default StudentCard;
