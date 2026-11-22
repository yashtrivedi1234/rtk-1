import { ExclamationTriangleIcon, InboxIcon } from "@heroicons/react/24/outline";

const Message = ({ children, error }) => {
  const Icon = error ? ExclamationTriangleIcon : InboxIcon;

  return (
    <div
      role={error ? "alert" : "status"}
      className={`flex flex-col items-center gap-3 rounded-2xl p-10 text-center ring-1 ${
        error ? "bg-danger-soft text-red-700 ring-red-200" : "bg-surface text-subtle ring-line shadow-soft"
      }`}
    >
      <Icon className="h-10 w-10" aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
};

export default Message;
