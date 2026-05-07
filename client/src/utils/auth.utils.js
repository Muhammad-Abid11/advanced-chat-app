import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { logoutApi } from "../api/auth/auth.api";


export const useLogout = () => {
  const navigate = useNavigate();
  const { logout, setLogoutLoading } = useAuthStore(); // your existing logout function

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logoutApi();
      logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);

      // fallback (important)
      logout();
      navigate("/login");
    } finally {
      setLogoutLoading(false);
    }
  };

  return handleLogout;
};