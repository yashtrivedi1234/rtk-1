const AuthCard = ({ title, subtitle, children, footer }) => {
  return (
    <div className="rounded-2xl bg-surface p-6 shadow-soft ring-1 ring-line">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mb-5 mt-1 text-sm text-subtle">{subtitle}</p>
      {children}
      {footer && <div className="mt-5 text-center text-sm text-subtle">{footer}</div>}
    </div>
  );
};

export default AuthCard;
