import { create } from "zustand";
import { UserProfile, UserRole } from "@/types/auth";

interface AuthState {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  setUser: (user: UserProfile | null) => void;
  setRole: (role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: "KHACH",
  isAuthenticated: false,
  setUser: (user) =>
    set({
      user,
      role: user?.role || "KHACH",
      isAuthenticated: Boolean(user && user.role !== "KHACH"),
    }),
  setRole: (role) =>
    set((state) => ({
      role,
      user: state.user ? { ...state.user, role } : null,
      isAuthenticated: role !== "KHACH",
    })),
  logout: () =>
    set({
      user: null,
      role: "KHACH",
      isAuthenticated: false,
    }),
}));
