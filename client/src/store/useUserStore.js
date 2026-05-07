import { create } from "zustand";
import { getAllUsers } from "../api/users/users.api";

const useUserStore = create((set) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true });
    try {
      const res = await getAllUsers();
      set({ users: res.data.users, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error("Error fetching users:", error);
    }
  },
}));

export default useUserStore;
