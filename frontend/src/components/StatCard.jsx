const StatCard = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-surface p-4 shadow-soft ring-1 ring-line">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-2xl font-bold leading-none">{value}</p>
        <p className="mt-1 truncate text-sm text-subtle">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;
