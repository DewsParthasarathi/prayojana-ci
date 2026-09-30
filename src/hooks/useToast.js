import { ToastManagerContext } from "@/components/Toast/ToastProvider";
import { useContext } from "react";

export const useToast = () => {
  const context = useContext(ToastManagerContext);

  if (!context) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }

  return context;
};
