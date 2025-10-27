"use client";

import { useState } from "react";
import { createBook, uploadBookCover, type BookRequestDTO } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { ALL_GENRES, translateGenre, type GenreType } from "@/lib/genres";

export default function UploadPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const [form, setForm] = useState<BookRequestDTO>({
    name: "",
    shortDescription: "",
    longDescription: "",
    genreType: [],
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenreToggle = (genre: GenreType) => {
    setForm((prev) => {
      const currentGenres = prev.genreType || [];
      const isSelected = currentGenres.includes(genre);
      
      if (isSelected) {
        return { ...prev, genreType: currentGenres.filter((g) => g !== genre) };
      } else {
        return { ...prev, genreType: [...currentGenres, genre] };
      }
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("A imagem deve ter no máximo 5MB");
        return;
      }
      
      // Validar tipo
      if (!file.type.startsWith('image/')) {
        setError("Por favor, selecione uma imagem válida");
        return;
      }
      
      setCoverImage(file);
      
      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleRemoveImage = () => {
    setCoverImage(null);
    setCoverPreview(null);
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
      
      // 1. Criar o livro
      const createdBook = await createBook(form);
      
      // 2. Se houver imagem, fazer upload da capa
      if (coverImage && createdBook.id) {
        await uploadBookCover(createdBook.id, coverImage);
      }
      
      setSuccess("Livro criado com sucesso!");
      setTimeout(() => router.push("/my-books"), 1500);
      
      // Limpar formulário
      setForm({ name: "", shortDescription: "", longDescription: "", genreType: [] });
      setCoverImage(null);
      setCoverPreview(null);
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
          <label className="block text-sm font-medium text-[#e8dcc8] mb-2">
            Capa do Livro (opcional)
          </label>
          
          {!coverPreview ? (
            <div className="relative">
              <input
                type="file"
                id="cover-upload"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="cover-upload"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-[#8b6f47] rounded-lg cursor-pointer hover:border-[#c9a961] transition-colors bg-[#2a1e13]"
              >
                <svg className="w-12 h-12 text-[#8b6f47] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-[#8b6f47] text-sm">Clique para selecionar uma imagem</p>
                <p className="text-[#6b5737] text-xs mt-1">PNG, JPG ou WEBP (máx. 5MB)</p>
              </label>
            </div>
          ) : (
            <div className="relative w-full h-64">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverPreview}
                alt="Preview da capa"
                className="w-full h-64 object-cover rounded-lg border-2 border-[#8b6f47]"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
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

        <div>
          <label className="block text-sm font-medium text-[#e8dcc8] mb-2">
            Gêneros ({form.genreType?.length || 0} selecionado{(form.genreType?.length || 0) !== 1 ? 's' : ''})
          </label>
          <div className="max-h-64 overflow-y-auto bg-[#2a1e13] border border-[#8b6f47] rounded-md p-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ALL_GENRES.map((genre) => {
                const isSelected = form.genreType?.includes(genre);
                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => handleGenreToggle(genre)}
                    className={`
                      px-3 py-1.5 rounded-md text-sm font-medium transition-all
                      ${isSelected 
                        ? 'bg-[#c9a961] text-[#1a1108] border-2 border-[#c9a961]' 
                        : 'bg-[#1a120a] text-[#cbbba2] border border-[#8b6f47] hover:border-[#c9a961]'
                      }
                    `}
                  >
                    {translateGenre(genre)}
                  </button>
                );
              })}
            </div>
          </div>
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
            onClick={() => {
              setForm({ name: "", shortDescription: "", longDescription: "", genreType: [] });
              setCoverImage(null);
              setCoverPreview(null);
            }}
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
