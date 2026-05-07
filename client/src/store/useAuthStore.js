import { create } from "zustand";
import { getMeApi } from "../api/auth/auth.api";
import { connectWebSocket, disconnectSocket } from "../config/socket";

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,
  isLoginLoading: false,
  isRegisterLoading: false,
  isLogoutLoading: false,

  setUser: (user) => set({ user }),
  setLoginLoading: (isLoginLoading) => set({ isLoginLoading }),
  setRegisterLoading: (isRegisterLoading) => set({ isRegisterLoading }),
  setLogoutLoading: (isLogoutLoading) => set({ isLogoutLoading }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  checkAuth: async () => {
    set({ loading: true });
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        set({ user: null, loading: false });
        return;
      }

      const res = await getMeApi();
      const userData = res.data.user;
      set({ user: userData, loading: false });

      // Connect socket if token exists
      connectWebSocket(token);
    } catch (error) {
      console.error("Auth check failed:", error);
      set({ user: null, loading: false, error: error.message });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      disconnectSocket();
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null });
    disconnectSocket();
  }
}));

export default useAuthStore;
