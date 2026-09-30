import { useContext } from "react";
import { ToastContext } from "@/components/Toast/toastContext";

export const useToastContext = (componentName) => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(`${componentName} must be rendered inside <Toast>`);
  }

  return context;
};
