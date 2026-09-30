const ToastTitle = ({ className = "", children }) => (
  <p className={`text-[1.8rem] font-semibold text-primary ${className}`}>{children}</p>
);

export default ToastTitle;
