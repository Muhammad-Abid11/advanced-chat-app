import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getMeApi } from "../api/auth/auth.api";
import { connectWebSocket, disconnectSocket } from "../config/socket";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: true,
      error: null,
      isLoginLoading: false,
      isRegisterLoading: false,
      isLogoutLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoginLoading: (isLoginLoading) => set({ isLoginLoading }),
      setRegisterLoading: (isRegisterLoading) => set({ isRegisterLoading }),
      setLogoutLoading: (isLogoutLoading) => set({ isLogoutLoading }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      checkAuth: async () => {
        // Optimization: Skip network request if we know we're not logged in
        if (!get().isAuthenticated) {
          set({ loading: false });
          return;
        }
        set({ loading: true });
        try {

          const res = await getMeApi();
          const userData = res.data.user;
          set({ user: userData, isAuthenticated: true, loading: false });

          // Connect socket
          connectWebSocket();
        } catch (error) {
          console.error("Auth check failed:", error);
          set({ user: null, isAuthenticated: false, loading: false, error: error.message });
          disconnectSocket();
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
        disconnectSocket();
      }
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }), // Only persist isAuthenticated
    }
  )
);

export default useAuthStore;
