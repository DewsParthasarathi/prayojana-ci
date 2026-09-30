import { useToastContext } from "@/hooks/useToastContext";

const toastStyles = {
  success: "border-l-4 border-l-green-500",
  error: "border-l-4 border-l-red-500",
  info: "border-l-4 border-l-blue",
};

const ToastContainer = ({ className = "", children }) => {
  const { variant } = useToastContext("Toast.Container");

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-start gap-3 w-[340px] max-w-[90vw] bg-white shadow-lg rounded-md p-4 pointer-events-auto ${
        toastStyles[variant] || toastStyles.info
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default ToastContainer;
