import Avatar from "../../../components/Avatar";

const StudentCard = ({ student, active, children }) => {
  return (
    <li
      className={`flex items-center gap-4 rounded-2xl bg-surface p-4 shadow-soft transition duration-200 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
        active ? "ring-2 ring-primary" : "ring-1 ring-line"
      }`}
    >
      <Avatar name={student.name} url={student.image?.url} />

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{student.name}</p>
        <p className="truncate text-sm text-subtle">{student.email}</p>
        <span className="mt-1.5 inline-block rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-primary">
          {student.course}
        </span>
      </div>

      {children}
    </li>
  );
};

export default StudentCard;
