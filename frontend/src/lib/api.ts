export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export type TokenResponseDTO = {
  accessToken: string | null;
  refreshToken: string | null;
};

export async function registerUser(payload: { name: string; email: string; password: string }) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Erro ao registrar.");
  }
  return true;
}

export async function loginUser(payload: { email: string; password: string }): Promise<TokenResponseDTO> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Credenciais inválidas.");
  }
  const data = (await res.json()) as TokenResponseDTO;
  return data;
}

export async function refreshToken(refreshToken: string): Promise<TokenResponseDTO> {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Não foi possível renovar o token.");
  }
  const data = (await res.json()) as TokenResponseDTO;
  return data;
}
