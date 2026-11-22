const PageHeader = ({ title, subtitle, action }) => {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-subtle">{subtitle}</p>
      </div>
      {action}
    </div>
  );
};

export default PageHeader;
