"use client";

import { useState, useEffect } from "react";
import { getAccessToken, clearTokens, decodeToken, isTokenExpired } from "@/lib/auth";
import { useTokenRefresh } from "./useTokenRefresh";
import { getMyProfile } from "@/lib/api";

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
    const checkAuth = async () => {
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
        // Primeiro: decodifica o token para ter um fallback imediato
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

        
        try {
          const me = await getMyProfile();
          setUser({ email: me.email, name: me.name });
        } catch (e) {
          console.warn("Não foi possível carregar o perfil atual: ", e);
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

    const onProfileUpdated = () => {
      
      checkAuth();
    };

    window.addEventListener("storage", checkAuth);
    window.addEventListener("auth-change", checkAuth);
    window.addEventListener("profile-updated", onProfileUpdated);
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("auth-change", checkAuth);
      window.removeEventListener("profile-updated", onProfileUpdated);
    };
  }, []);

  const logout = () => {
    clearTokens();
    setUser(null);
    window.location.href = "/";
  };

  return { user, isLoading, isAuthenticated: !!user, logout };
}
