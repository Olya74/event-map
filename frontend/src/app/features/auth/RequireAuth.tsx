import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../hooks/hooks";
import { selectedCurrentToken } from "./authSlice";

const RequireAuth = () => {
  const token = useAppSelector(selectedCurrentToken);
  const location = useLocation();
  return token ? (
    <Outlet />
  ) : (
  
    <Navigate to="/login" state={{ from: location }} replace />
  
  );
};

export default RequireAuth;
