const Field = ({ label, error, ...inputProps }) => {
  const id = inputProps.name;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">{label}</label>
      <input
        id={id}
        autoComplete="off"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`min-h-11 w-full rounded-xl border bg-surface px-3.5 outline-none transition duration-200 placeholder:text-slate-400 focus:ring-4 ${
          error ? "border-danger focus:ring-danger/15" : "border-line focus:border-primary focus:ring-primary/15"
        }`}
        {...inputProps}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-red-700">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default Field;
