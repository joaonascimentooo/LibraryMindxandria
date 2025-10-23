"use client";

import { useEffect, useState } from "react";
import { getMyProfile, getMyBooks, updateProfile, refreshToken, type UserResponseDTO, type BookResponseDTO } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { getRefreshToken, setTokens } from "@/lib/auth";

export default function ProfilePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [profile, setProfile] = useState<UserResponseDTO | null>(null);
  const [books, setBooks] = useState<BookResponseDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Edição de nome
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!isAuthenticated) return;
      try {
        const [me, myBooks] = await Promise.all([
          getMyProfile(),
          getMyBooks(),
        ]);
        setProfile(me);
        setNameInput(me.name);
        setBooks(myBooks);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
      }
    };
    load();
  }, [isAuthenticated]);

  const onSaveName = async () => {
    if (!profile) return;
    if (!nameInput.trim()) {
      setError("O nome não pode estar vazio.");
      return;
    }
    try {
      setSavingName(true);
      setError(null);
      setSuccess(null);
      const updated = await updateProfile({ name: nameInput.trim() });
      setProfile((prev) => (prev ? { ...prev, name: updated.name } : updated));
      setIsEditingName(false);

      // Tenta renovar o access token para refletir o novo nome no Header imediatamente
      const rt = getRefreshToken();
      if (rt) {
        const tokens = await refreshToken(rt);
        if (tokens.accessToken || tokens.refreshToken) {
          setTokens(tokens.accessToken, tokens.refreshToken);
        }
      }
      setSuccess("Nome atualizado com sucesso!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setSavingName(false);
    }
  };

  if (!isLoading && !isAuthenticated) {
    return (
      <main className="min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-[#c9a961] mb-4">Meu Perfil</h1>
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
        <h1 className="text-3xl font-bold text-[#c9a961] mb-6">Meu Perfil</h1>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-900/30 border border-green-700 text-green-200 px-4 py-2 rounded mb-4">
            {success}
          </div>
        )}

        <section className="bg-[#1a120a] border border-[#8b6f47] rounded-lg p-6 mb-8">
          {!profile ? (
            <div className="animate-pulse text-[#cbbba2]">Carregando perfil...</div>
          ) : (
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a961] to-[#8b6f47] flex items-center justify-center text-[#1a1108] font-bold text-lg shadow-md">
                {(isEditingName ? nameInput : profile.name)?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex-1">
                {isEditingName ? (
                  <div className="space-y-3">
                    <label className="block text-sm text-[#cbbba2]">Nome</label>
                    <input
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full rounded-md bg-[#2a1e13] text-[#e8dcc8] border border-[#8b6f47] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a961]"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={onSaveName}
                        disabled={savingName}
                        className="bg-[#c9a961] text-[#1a1108] px-4 py-2 rounded font-semibold hover:bg-[#8b6f47] hover:text-[#e8dcc8] transition-all disabled:opacity-60"
                      >
                        {savingName ? "Salvando..." : "Salvar"}
                      </button>
                      <button
                        onClick={() => { setIsEditingName(false); setNameInput(profile.name); }}
                        disabled={savingName}
                        className="bg-[#2a1e13] text-[#e8dcc8] px-4 py-2 rounded border border-[#8b6f47] hover:bg-[#3a2e23] transition-all disabled:opacity-60"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-[#e8dcc8] font-semibold text-lg">{profile.name}</div>
                    <div className="text-[#9b8c78] text-sm">{profile.email}</div>
                    <button
                      onClick={() => { setIsEditingName(true); setSuccess(null); setError(null); }}
                      className="mt-3 bg-[#8b6f47] text-[#e8dcc8] px-4 py-1.5 rounded font-semibold hover:bg-[#c9a961] hover:text-[#1a1108] transition-all"
                    >
                      ✏️ Editar Nome
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#c9a961] mb-4">Meus Livros</h2>
          <div className="bg-[#1a120a] border border-[#8b6f47] rounded-lg p-6">
            {!books ? (
              <div className="animate-pulse text-[#cbbba2]">Carregando livros...</div>
            ) : books.length === 0 ? (
              <div className="text-[#cbbba2]">Você ainda não possui livros.</div>
            ) : (
              <ul className="space-y-3">
                {books.map((b) => (
                  <li key={b.id} className="border border-[#4a3620] rounded p-3 hover:border-[#8b6f47] transition">
                    <div className="text-[#e8dcc8] font-medium">{b.name}</div>
                    {b.shortDescription && (
                      <div className="text-[#9b8c78] text-sm">{b.shortDescription}</div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
