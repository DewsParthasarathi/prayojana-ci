const ToastDescription = ({ className = "", children }) => (
  <p className={`text-[2rem] text-label-gray mt-1 break-words ${className}`}>{children}</p>
);

export default ToastDescription;
