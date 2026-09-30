import { useToastContext } from "@/hooks/useToastContext";

const ICONS = {
  success: (
    <svg viewBox="0 0 24 24" fill="none" className="h-[3rem] w-[3rem] text-green-500">
      <path
        d="M20 6 9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" fill="none" className="h-[3rem] w-[3rem] text-red-500">
      <path
        d="M18 6 6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" fill="none" className="h-[3rem] w-[3rem] text-blue">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8v.01M12 11v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

const ToastIcon = ({ children }) => {
  const { variant } = useToastContext("Toast.Icon");

  return <span className="shrink-0 mt-0.5">{children ?? ICONS[variant] ?? ICONS.info}</span>;
};

export default ToastIcon;
