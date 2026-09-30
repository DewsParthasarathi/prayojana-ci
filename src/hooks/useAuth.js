import { useSelector } from "react-redux";

export const useAuth = () => {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const pendingMobile = useSelector((state) => state.auth.pendingMobile);

  return { user, isAuthenticated, pendingMobile };
};
