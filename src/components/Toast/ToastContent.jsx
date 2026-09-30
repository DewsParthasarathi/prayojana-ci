const ToastContent = ({ className = "", children }) => (
  <div className={`flex-1 min-w-0 ${className}`}>{children}</div>
);

export default ToastContent;
