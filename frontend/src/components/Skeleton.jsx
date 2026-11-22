const Skeleton = ({ count = 3 }) => {
  return (
    <ul className="space-y-3" aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="flex animate-pulse items-center gap-4 rounded-2xl bg-surface p-4 shadow-soft ring-1 ring-line motion-reduce:animate-none">
          <div className="h-12 w-12 rounded-full bg-line" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 rounded bg-line" />
            <div className="h-3 w-1/2 rounded bg-line" />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Skeleton;
