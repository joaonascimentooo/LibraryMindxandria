import { getAccessToken, getRefreshToken, setTokens, clearTokens, isTokenExpiringSoon } from "./auth";
import { refreshToken as refreshTokenAPI } from "./api";

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

async function attemptTokenRefresh(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    return null;
  }

  try {
    const tokens = await refreshTokenAPI(refreshToken);
    if (tokens.accessToken && tokens.refreshToken) {
      setTokens(tokens.accessToken, tokens.refreshToken);
      return tokens.accessToken;
    }
    return null;
  } catch {
    clearTokens();
    return null;
  }
}

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  let accessToken = getAccessToken();

  // Se o token está próximo de expirar e não está renovando, renova preventivamente
  if (accessToken && isTokenExpiringSoon(accessToken) && !isRefreshing) {
    isRefreshing = true;
    const newToken = await attemptTokenRefresh();
    isRefreshing = false;
    
    if (newToken) {
      accessToken = newToken;
      onTokenRefreshed(newToken);
    }
  }

  // Adiciona o token ao header
  const headers = new Headers(options.headers);
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  // Faz a requisição
  let response = await fetch(url, { ...options, headers });

  // Se receber 401, tenta renovar o token e repetir a requisição
  if (response.status === 401 && !isRefreshing) {
    isRefreshing = true;
    const newToken = await attemptTokenRefresh();
    isRefreshing = false;

    if (newToken) {
      onTokenRefreshed(newToken);
      // Refaz a requisição com o novo token
      headers.set("Authorization", `Bearer ${newToken}`);
      response = await fetch(url, { ...options, headers });
    } else {
      // Se não conseguiu renovar, redireciona para login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }

  return response;
}
