import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

const ProtectedRoute = () => {
  const { user, loading } = useAuthStore();

  if (loading) return null; // Wait for auth check

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
