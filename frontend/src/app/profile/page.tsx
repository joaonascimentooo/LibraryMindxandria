"use client";

import { useEffect, useState } from "react";
import { getMyProfile, updateProfile, deleteAccount, refreshToken, type UserResponseDTO } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { getRefreshToken, setTokens } from "@/lib/auth";

export default function ProfilePage() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [profile, setProfile] = useState<UserResponseDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Edição de nome
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [savingName, setSavingName] = useState(false);

  // Exclusão de conta
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!isAuthenticated) return;
      try {
        const me = await getMyProfile();
        setProfile(me);
        setNameInput(me.name);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
      }
    };
    load();
  }, [isAuthenticated]);

  const onDeleteAccount = async () => {
    try {
      setDeleting(true);
      setError(null);
      await deleteAccount();
      logout();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

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


        {/* Danger Zone */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-red-400 mb-4">Zona de Perigo</h2>
          <div className="bg-[#1a120a] border border-red-700 rounded-lg p-6">
            <p className="text-[#e8dcc8] mb-4">
              Excluir sua conta é uma ação permanente e não pode ser desfeita.
            </p>
            {!confirmDelete ? (
              <button
                onClick={() => { setConfirmDelete(true); setError(null); setSuccess(null); }}
                className="bg-red-700 text-white px-4 py-2 rounded font-semibold hover:bg-red-800 transition-all"
              >
                🗑️ Excluir minha conta
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-[#cbbba2]">Tem certeza que deseja prosseguir?</p>
                <div className="flex gap-3">
                  <button
                    onClick={onDeleteAccount}
                    disabled={deleting}
                    className="bg-red-700 text-white px-4 py-2 rounded font-semibold hover:bg-red-800 transition-all disabled:opacity-60"
                  >
                    {deleting ? "Excluindo..." : "Sim, excluir"}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    disabled={deleting}
                    className="bg-[#2a1e13] text-[#e8dcc8] px-4 py-2 rounded border border-[#8b6f47] hover:bg-[#3a2e23] transition-all disabled:opacity-60"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
