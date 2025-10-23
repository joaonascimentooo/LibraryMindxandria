export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

import { fetchWithAuth } from "./fetchWithAuth";

export type TokenResponseDTO = {
  accessToken: string | null;
  refreshToken: string | null;
};

export type UserResponseDTO = {
  id: string;
  name: string;
  email: string;
};

// Books
export type BookRequestDTO = {
  name: string;
  shortDescription: string;
  longDescription: string;
};

export type BookResponseDTO = {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
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

export async function createBook(payload: BookRequestDTO): Promise<BookResponseDTO> {
  const res = await fetchWithAuth(`${API_URL}/books/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Erro ao criar livro.");
  }
  return (await res.json()) as BookResponseDTO;
}

export async function getMyProfile(): Promise<UserResponseDTO> {
  const res = await fetchWithAuth(`${API_URL}/users/me`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Não foi possível carregar o perfil.");
  }
  return (await res.json()) as UserResponseDTO;
}

export async function getMyBooks(): Promise<BookResponseDTO[]> {
  const res = await fetchWithAuth(`${API_URL}/books`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Não foi possível carregar seus livros.");
  }
  return (await res.json()) as BookResponseDTO[];
}

export async function updateProfile(payload: { name: string }): Promise<UserResponseDTO> {
  const res = await fetchWithAuth(`${API_URL}/users`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Não foi possível atualizar o perfil.");
  }
  return (await res.json()) as UserResponseDTO;
}

export async function updateBook(id: string, payload: BookRequestDTO): Promise<BookResponseDTO> {
  const res = await fetchWithAuth(`${API_URL}/books/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Erro ao atualizar livro.");
  }
  return (await res.json()) as BookResponseDTO;
}

export async function deleteBook(id: string): Promise<void> {
  const res = await fetchWithAuth(`${API_URL}/books/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Erro ao deletar livro.");
  }
}
