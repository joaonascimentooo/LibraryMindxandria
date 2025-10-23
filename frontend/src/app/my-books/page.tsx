"use client";

import { useEffect, useState } from "react";
import { getMyBooks, updateBook, deleteBook, type BookResponseDTO, type BookRequestDTO } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { translateGenres } from "@/lib/genres";

export default function MyBooksPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [books, setBooks] = useState<BookResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para edição
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<BookRequestDTO>({
    name: "",
    shortDescription: "",
    longDescription: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Estados para confirmação de exclusão
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        const myBooks = await getMyBooks();
        setBooks(myBooks);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isAuthenticated]);

  const handleEdit = (book: BookResponseDTO) => {
    setEditingId(book.id);
    setEditForm({
      name: book.name,
      shortDescription: book.shortDescription,
      longDescription: book.longDescription,
    });
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", shortDescription: "", longDescription: "" });
    setError(null);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editForm.name.trim()) {
      setError("O título é obrigatório.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const updated = await updateBook(id, editForm);
      setBooks((prev) => prev.map((b) => (b.id === id ? updated : b)));
      setEditingId(null);
      setEditForm({ name: "", shortDescription: "", longDescription: "" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      await deleteBook(id);
      setBooks((prev) => prev.filter((b) => b.id !== id));
      setDeletingId(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    }
  };

  if (!isLoading && !isAuthenticated) {
    return (
      <main className="min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-[#c9a961] mb-4">Meus Livros</h1>
          <div className="bg-[#1a120a] border border-[#8b6f47] p-6 rounded-lg text-[#e8dcc8]">
            Você precisa estar logado para acessar esta página.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#c9a961]">Meus Livros</h1>
          <Link
            href="/upload"
            className="bg-[#c9a961] text-[#1a1108] px-6 py-2 rounded-full font-semibold hover:bg-[#8b6f47] hover:text-[#e8dcc8] transition-all"
          >
            ➕ Novo Livro
          </Link>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-[#1a120a] border border-[#8b6f47] rounded-lg p-8 text-center">
            <div className="animate-pulse text-[#cbbba2]">Carregando seus livros...</div>
          </div>
        ) : books.length === 0 ? (
          <div className="bg-[#1a120a] border border-[#8b6f47] rounded-lg p-8 text-center">
            <p className="text-[#cbbba2] mb-4">Você ainda não possui livros cadastrados.</p>
            <Link
              href="/upload"
              className="inline-block bg-[#c9a961] text-[#1a1108] px-6 py-2 rounded-full font-semibold hover:bg-[#8b6f47] hover:text-[#e8dcc8] transition-all"
            >
              Adicionar meu primeiro livro
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {books.map((book) => (
              <div key={book.id} className="bg-[#1a120a] border border-[#8b6f47] rounded-lg p-6">
                {editingId === book.id ? (
                  // Modo de edição
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#e8dcc8] mb-1">
                        Título
                      </label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full rounded-md bg-[#2a1e13] text-[#e8dcc8] border border-[#8b6f47] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a961]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#e8dcc8] mb-1">
                        Descrição curta
                      </label>
                      <input
                        type="text"
                        value={editForm.shortDescription}
                        onChange={(e) => setEditForm({ ...editForm, shortDescription: e.target.value })}
                        className="w-full rounded-md bg-[#2a1e13] text-[#e8dcc8] border border-[#8b6f47] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a961]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#e8dcc8] mb-1">
                        Descrição longa
                      </label>
                      <textarea
                        value={editForm.longDescription}
                        onChange={(e) => setEditForm({ ...editForm, longDescription: e.target.value })}
                        rows={4}
                        className="w-full rounded-md bg-[#2a1e13] text-[#e8dcc8] border border-[#8b6f47] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a961]"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleSaveEdit(book.id)}
                        disabled={submitting}
                        className="bg-[#c9a961] text-[#1a1108] px-4 py-2 rounded font-semibold hover:bg-[#8b6f47] hover:text-[#e8dcc8] transition-all disabled:opacity-60"
                      >
                        {submitting ? "Salvando..." : "✅ Salvar"}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={submitting}
                        className="bg-[#2a1e13] text-[#e8dcc8] px-4 py-2 rounded border border-[#8b6f47] hover:bg-[#3a2e23] transition-all disabled:opacity-60"
                      >
                        ❌ Cancelar
                      </button>
                    </div>
                  </div>
                ) : deletingId === book.id ? (
                  // Modo de confirmação de exclusão
                  <div>
                    <p className="text-[#e8dcc8] mb-4">
                      Tem certeza que deseja excluir <strong>&quot;{book.name}&quot;</strong>?
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="bg-red-700 text-white px-4 py-2 rounded font-semibold hover:bg-red-800 transition-all"
                      >
                        🗑️ Sim, excluir
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="bg-[#2a1e13] text-[#e8dcc8] px-4 py-2 rounded border border-[#8b6f47] hover:bg-[#3a2e23] transition-all"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  // Modo de visualização
                  <div>
                    <h2 className="text-xl font-bold text-[#c9a961] mb-2">{book.name}</h2>
                    {book.genreType && book.genreType.length > 0 && (
                      <div className="mb-3">
                        <span className="text-xs text-[#9b8c78] font-medium uppercase tracking-wide">Gêneros: </span>
                        <span className="text-sm text-[#c9a961]">{translateGenres(book.genreType)}</span>
                      </div>
                    )}
                    {book.shortDescription && (
                      <p className="text-[#e8dcc8] mb-2">{book.shortDescription}</p>
                    )}
                    {book.longDescription && (
                      <p className="text-[#9b8c78] text-sm mb-4">{book.longDescription}</p>
                    )}
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleEdit(book)}
                        className="bg-[#8b6f47] text-[#e8dcc8] px-4 py-2 rounded font-semibold hover:bg-[#c9a961] hover:text-[#1a1108] transition-all"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => setDeletingId(book.id)}
                        className="bg-[#2a1e13] text-red-400 px-4 py-2 rounded border border-red-700 hover:bg-red-900/30 transition-all"
                      >
                        🗑️ Excluir
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
