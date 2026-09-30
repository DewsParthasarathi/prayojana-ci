import { createContext, useCallback, useContext, useRef, useState } from "react";
import ConfirmationModal from "@/components/modal-component/ConfirmationModal";

const ConfirmContext = createContext(null);

const DEFAULT_OPTIONS = {
  title: "Confirm Delete",
  message: "Are you sure you want to delete this record? This action cannot be undone.",
  confirmLabel: "OK",
  cancelLabel: "Cancel",
  variant: "danger",
};

export const ConfirmProvider = ({ children }) => {
  const [state, setState] = useState({ isOpen: false, options: DEFAULT_OPTIONS });
  const resolverRef = useRef(null);

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setState({ isOpen: true, options: { ...DEFAULT_OPTIONS, ...options } });
    });
  }, []);

  const handleClose = () => {
    setState((prev) => ({ ...prev, isOpen: false }));
    if (resolverRef.current) {
      resolverRef.current(false);
      resolverRef.current = null;
    }
  };

  const handleConfirm = () => {
    setState((prev) => ({ ...prev, isOpen: false }));
    if (resolverRef.current) {
      resolverRef.current(true);
      resolverRef.current = null;
    }
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmationModal
        isOpen={state.isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title={state.options.title}
        message={state.options.message}
        confirmLabel={state.options.confirmLabel}
        cancelLabel={state.options.cancelLabel}
        variant={state.options.variant}
      />
    </ConfirmContext.Provider>
  );
};
export const useConfirm = () => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm must be used inside <ConfirmProvider>");
  }
  return ctx;
};
