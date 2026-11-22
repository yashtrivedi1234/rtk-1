const Button = ({ loading, loadingText = "Please wait...", children, ...props }) => {
  return (
    <button
      disabled={loading}
      className="min-h-11 w-full cursor-pointer rounded-xl bg-primary px-6 font-semibold text-white transition-colors duration-200 hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
      {...props}
    >
      {loading ? loadingText : children}
    </button>
  );
};

export default Button;
