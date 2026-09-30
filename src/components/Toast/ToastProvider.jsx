import { useCallback, useRef, useState, createContext } from "react";
import Toast from "./Toast";

const DEFAULT_DURATION = 5000;

export const ToastManagerContext = createContext(null);
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ variant = "info", title, description, duration = DEFAULT_DURATION }) => {
      const id = ++idRef.current;

      setToasts((current) => [
        ...current,
        {
          id,
          variant,
          title,
          description,
        },
      ]);

      if (duration) {
        setTimeout(() => removeToast(id), duration);
      }

      return id;
    },
    [removeToast],
  );

  return (
    <ToastManagerContext.Provider value={{ showToast, removeToast }}>
      {children}

      <div className="fixed top-4 right-4 z-[1000] flex flex-col gap-3 pointer-events-none">
        {toasts.map(({ id, variant, title, description }) => (
          <Toast key={id} variant={variant} onClose={() => removeToast(id)}>
            <Toast.Container>
              <Toast.Icon />

              <Toast.Content>
                {title && <Toast.Title>{title}</Toast.Title>}
                {description && <Toast.Description>{description}</Toast.Description>}
              </Toast.Content>

              <Toast.Close />
            </Toast.Container>
          </Toast>
        ))}
      </div>
    </ToastManagerContext.Provider>
  );
};
