// Loading / error / khali list ka chhota sa message box
const Message = ({ children, error }) => {
  return (
    <p className={`rounded-xl p-6 text-center ${error ? "bg-red-50 text-red-600" : "bg-white text-slate-500 ring-1 ring-slate-200"}`}>
      {children}
    </p>
  );
};

export default Message;
