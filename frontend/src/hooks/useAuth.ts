"use client";

import { useState, useEffect } from "react";
import { getAccessToken, clearTokens, decodeToken, isTokenExpired } from "@/lib/auth";
import { useTokenRefresh } from "./useTokenRefresh";

type UserInfo = {
  email: string;
  name?: string;
} | null;

export function useAuth() {
  const [user, setUser] = useState<UserInfo>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hook que gerencia a renovação automática de tokens
  useTokenRefresh();

  useEffect(() => {
    const checkAuth = () => {
      const token = getAccessToken();
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Verifica se o token expirou
      if (isTokenExpired(token)) {
        clearTokens();
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const decoded = decodeToken(token);
        if (decoded) {
          setUser({
            email: decoded.sub || decoded.email || "",
            name: decoded.name || decoded.sub?.split("@")[0] || "Usuário",
          });
        } else {
          clearTokens();
          setUser(null);
        }
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
        clearTokens();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);
    window.addEventListener("auth-change", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("auth-change", checkAuth);
    };
  }, []);

  const logout = () => {
    clearTokens();
    setUser(null);
    window.location.href = "/";
  };

  return { user, isLoading, isAuthenticated: !!user, logout };
}
