"use client";

import { useEffect, useRef } from "react";
import { getAccessToken, getRefreshToken, isTokenExpiringSoon, setTokens, clearTokens } from "@/lib/auth";
import { refreshToken as refreshTokenAPI } from "@/lib/api";

export function useTokenRefresh() {
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);

  useEffect(() => {
    const attemptTokenRefresh = async () => {
      // Evita múltiplas tentativas simultâneas
      if (isRefreshingRef.current) return;

      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      // Se não tem tokens, não faz nada
      if (!accessToken || !refreshToken) {
        return;
      }

      // Verifica se o access token está próximo de expirar
      if (isTokenExpiringSoon(accessToken)) {
        try {
          isRefreshingRef.current = true;
          console.log("🔄 Renovando access token...");
          
          const tokens = await refreshTokenAPI(refreshToken);
          
          if (tokens.accessToken && tokens.refreshToken) {
            setTokens(tokens.accessToken, tokens.refreshToken);
            console.log("✅ Token renovado com sucesso!");
          } else {
            throw new Error("Tokens inválidos retornados");
          }
        } catch (error) {
          console.error("❌ Erro ao renovar token:", error);
          // Se falhar ao renovar, faz logout
          clearTokens();
        } finally {
          isRefreshingRef.current = false;
        }
      }
    };

    // Verifica imediatamente ao montar
    attemptTokenRefresh();

    // Verifica a cada 1 minuto se precisa renovar
    refreshIntervalRef.current = setInterval(attemptTokenRefresh, 60000);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);
}
