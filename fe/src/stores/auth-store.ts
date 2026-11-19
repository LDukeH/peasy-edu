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

// Giả lập người dùng mặc định khi chạy dev để tiện kiểm thử phân quyền UI
const DEFAULT_USER: UserProfile = {
  id: "NV001",
  name: "Lê Hoàng Duy",
  phone: "0901234567",
  email: "admin@giasu.edu.vn",
  role: "CHU_TRUNG_TAM",
};

export const useAuthStore = create<AuthState>((set) => ({
  user: DEFAULT_USER,
  role: "CHU_TRUNG_TAM",
  isAuthenticated: true,
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
