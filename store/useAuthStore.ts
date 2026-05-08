import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  branch?: string;
  course?: string;
  slug?: string; // alumni only
}

export interface AuthUser {
  id: string;
  email: string;
  role: "STUDENT" | "ALUMNI" | "ADMIN" | "DEVELOPER";
  status: string;
  profile?: UserProfile | null;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;

  setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  updateToken: (accessToken: string) => void;
  updateUser: (user: Partial<AuthUser>) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,

      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken }),

      updateToken: (accessToken) => set({ accessToken }),

      updateUser: (partial) =>
        set((s) => ({ user: s.user ? { ...s.user, ...partial } : null })),

      clearAuth: () =>
        set({ user: null, accessToken: null, refreshToken: null }),

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "alumniverse-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        user: s.user,
        refreshToken: s.refreshToken,
        // Don't persist accessToken - always refresh on reload
      }),
    }
  )
);
