"use client";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

export function useAuth() {
  const router = useRouter();
  const { user, accessToken, setAuth, clearAuth, setLoading, isLoading } = useAuthStore();

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const res = await axios.post("/api/auth/login", { email, password });
        return res.data; // { userId, requiresOtp: true }
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  const verifyOTP = useCallback(
    async (userId: string, code: string, type = "login") => {
      setLoading(true);
      try {
        const res = await axios.post("/api/auth/verify-otp", { userId, code, type });
        const { user, accessToken, refreshToken } = res.data;
        setAuth(user, accessToken, refreshToken);
        // Set cookie
        document.cookie = `access_token=${accessToken}; path=/; max-age=900; SameSite=Strict`;
        router.push("/dashboard");
        return res.data;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setAuth, router]
  );

  const logout = useCallback(async () => {
    try {
      await axios.post("/api/auth/logout", {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch {}
    clearAuth();
    document.cookie = "access_token=; path=/; max-age=0";
    router.push("/login");
  }, [accessToken, clearAuth, router]);

  const refreshAccessToken = useCallback(async () => {
    const { refreshToken } = useAuthStore.getState();
    if (!refreshToken) return null;
    try {
      const res = await axios.post("/api/auth/refresh", { refreshToken });
      useAuthStore.getState().updateToken(res.data.accessToken);
      document.cookie = `access_token=${res.data.accessToken}; path=/; max-age=900; SameSite=Strict`;
      return res.data.accessToken;
    } catch {
      clearAuth();
      return null;
    }
  }, [clearAuth]);

  return { user, accessToken, isLoading, login, verifyOTP, logout, refreshAccessToken };
}
