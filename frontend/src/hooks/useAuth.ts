"use client";

import { useState, useEffect } from "react";
import { getAccessToken, clearTokens } from "@/lib/auth";

type UserInfo = {
  email: string;
  name?: string;
} | null;

export function useAuth() {
  const [user, setUser] = useState<UserInfo>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = getAccessToken();
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        // Decodificar JWT (formato: header.payload.signature)
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        
        // Verificar se o token expirou
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          clearTokens();
          setUser(null);
        } else {
          setUser({
            email: decoded.sub || decoded.email || "",
            name: decoded.name || decoded.sub?.split("@")[0] || "Usuário",
          });
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

    // Revalidar quando o localStorage mudar (ex.: login em outra aba)
    window.addEventListener("storage", checkAuth);
    // Revalidar quando houver mudança de auth na mesma aba
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
