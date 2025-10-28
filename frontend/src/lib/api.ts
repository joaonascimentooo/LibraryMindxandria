export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

import { fetchWithAuth } from "./fetchWithAuth";
import { GenreType } from "./genres";

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
  genreType?: GenreType[];
};

export type BookResponseDTO = {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  genreType?: GenreType[];
  coverImageUrl?: string;
};

// Genres stats
export type GenreStatDTO = {
  genre: GenreType;
  count: number;
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

export async function uploadBookCover(bookId: string, file: File): Promise<BookResponseDTO> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetchWithAuth(`${API_URL}/books/${bookId}/cover`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Erro ao fazer upload da capa.");
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

export async function deleteAccount(): Promise<void> {
  const res = await fetchWithAuth(`${API_URL}/users`, { method: "DELETE" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Não foi possível excluir a conta.");
  }
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

export async function getGenreStats(): Promise<GenreStatDTO[]> {
  const res = await fetch(`${API_URL}/books/stats`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Não foi possível carregar as estatísticas de gênero.");
  }
  return (await res.json()) as GenreStatDTO[];
}

export type PageResponseDTO<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
};

export async function getAllBooks(search?: string, page: number = 0, size: number = 20): Promise<PageResponseDTO<BookResponseDTO>> {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  params.append("page", page.toString());
  params.append("size", size.toString());

  const url = `${API_URL}/books/all?${params.toString()}`;
  console.log('Fetching books from:', url);
  
  try {
    const res = await fetch(url);
    console.log('Response status:', res.status);
    
    if (!res.ok) {
      const text = await res.text();
      console.error('API Error:', text);
      throw new Error(text || `Erro ${res.status}: Não foi possível carregar os livros.`);
    }
    
    const data = await res.json();
    console.log('Books loaded:', data);
    return data as PageResponseDTO<BookResponseDTO>;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
}
