"use client";

import { useState } from "react";
import { createBook, type BookRequestDTO } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const [form, setForm] = useState<BookRequestDTO>({
    name: "",
    shortDescription: "",
    longDescription: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.name.trim()) {
      setError("O título é obrigatório.");
      return;
    }
    if (!isAuthenticated) {
      setError("Você precisa estar logado para fazer upload.");
      return;
    }

    try {
      setSubmitting(true);
      await createBook(form);
      setSuccess("Livro criado com sucesso!");
      setTimeout(() => router.push("/"), 1200);
      setForm({ name: "", shortDescription: "", longDescription: "" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Falha ao criar o livro.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoading && !isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#0f0a05] text-[#e8dcc8]">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="w-full max-w-xl">
            <h1 className="text-3xl font-bold text-[#c9a961] mb-4 text-center">Upload de Livro</h1>
            <div className="bg-[#1a120a] border border-[#8b6f47] text-[#e8dcc8] p-6 rounded-lg text-center">
              Você precisa estar logado para fazer upload. Acesse a página de Login.
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f0a05] text-[#e8dcc8]">
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl font-bold text-[#c9a961] mb-6 text-center">Upload de Livro</h1>

          <form onSubmit={handleSubmit} className="space-y-5 bg-[#1a120a] border border-[#8b6f47] p-6 rounded-lg shadow-lg">
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-2 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-900/30 border border-green-700 text-green-200 px-4 py-2 rounded">
            {success}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#e8dcc8] mb-1">
            Título
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-md bg-[#2a1e13] text-[#e8dcc8] border border-[#8b6f47] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a961]"
            placeholder="Ex.: A Biblioteca Invisível"
            required
          />
        </div>

        <div>
          <label htmlFor="shortDescription" className="block text-sm font-medium text-[#e8dcc8] mb-1">
            Descrição curta
          </label>
          <input
            id="shortDescription"
            name="shortDescription"
            type="text"
            value={form.shortDescription}
            onChange={handleChange}
            className="w-full rounded-md bg-[#2a1e13] text-[#e8dcc8] border border-[#8b6f47] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a961]"
            placeholder="Uma sinopse breve do livro"
          />
        </div>

        <div>
          <label htmlFor="longDescription" className="block text-sm font-medium text-[#e8dcc8] mb-1">
            Descrição longa
          </label>
          <textarea
            id="longDescription"
            name="longDescription"
            value={form.longDescription}
            onChange={handleChange}
            rows={6}
            className="w-full rounded-md bg-[#2a1e13] text-[#e8dcc8] border border-[#8b6f47] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a961]"
            placeholder="Conte mais detalhes sobre o livro"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#c9a961] text-[#1a1108] px-6 py-2 rounded-full font-semibold hover:bg-[#8b6f47] hover:text-[#e8dcc8] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Enviando..." : "Salvar"}
          </button>
          <button
            type="button"
            onClick={() => setForm({ name: "", shortDescription: "", longDescription: "" })}
            className="text-[#e8dcc8] hover:text-[#c9a961] transition-colors"
          >
            Limpar
          </button>
        </div>
        </form>
        </div>
      </div>
    </main>
  );
}
