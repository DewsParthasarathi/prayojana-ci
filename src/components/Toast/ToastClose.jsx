import { useToastContext } from "@/hooks/useToastContext";

const ToastClose = ({ className = "", "aria-label": ariaLabel = "Dismiss" }) => {
  const { onClose } = useToastContext("Toast.Close");

  return (
    <button
      type="button"
      onClick={onClose}
      aria-label={ariaLabel}
      className={`shrink-0 text-label-gray hover:text-primary transition-colors ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-[2rem] w-[2rem]">
        <path
          d="M18 6 6 18M6 6l12 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default ToastClose;
