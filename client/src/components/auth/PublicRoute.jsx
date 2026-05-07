import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

const PublicRoute = () => {
  const { user, loading } = useAuthStore();

  if (loading) return null;

  return !user ? <Outlet /> : <Navigate to="/chat" replace />;
};

export default PublicRoute;
