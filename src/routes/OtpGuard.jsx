import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "./routes";

const OtpGuard = () => {
  const { isAuthenticated, pendingMobile } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOUSEHOLD} replace />;
  }

  if (!pendingMobile) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};

export default OtpGuard;
