import { ToastContext } from "./toastContext";
import ToastContainer from "./ToastContainer";
import ToastIcon from "./ToastIcon";
import ToastContent from "./ToastContent";
import ToastTitle from "./ToastTitle";
import ToastDescription from "./ToastDescription";
import ToastClose from "./ToastClose";

const Toast = ({ variant = "info", onClose = () => {}, children }) => {
  return <ToastContext.Provider value={{ variant, onClose }}>{children}</ToastContext.Provider>;
};

Toast.Container = ToastContainer;
Toast.Icon = ToastIcon;
Toast.Content = ToastContent;
Toast.Title = ToastTitle;
Toast.Description = ToastDescription;
Toast.Close = ToastClose;

export default Toast;
