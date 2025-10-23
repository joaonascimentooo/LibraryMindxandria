"use client";

import { useEffect, useState } from "react";
import { getMyProfile, getMyBooks, type UserResponseDTO, type BookResponseDTO } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [profile, setProfile] = useState<UserResponseDTO | null>(null);
  const [books, setBooks] = useState<BookResponseDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!isAuthenticated) return;
      try {
        const [me, myBooks] = await Promise.all([
          getMyProfile(),
          getMyBooks(),
        ]);
        setProfile(me);
        setBooks(myBooks);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
      }
    };
    load();
  }, [isAuthenticated]);

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

        <section className="bg-[#1a120a] border border-[#8b6f47] rounded-lg p-6 mb-8">
          {!profile ? (
            <div className="animate-pulse text-[#cbbba2]">Carregando perfil...</div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a961] to-[#8b6f47] flex items-center justify-center text-[#1a1108] font-bold text-lg shadow-md">
                {profile.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <div className="text-[#e8dcc8] font-semibold text-lg">{profile.name}</div>
                <div className="text-[#9b8c78] text-sm">{profile.email}</div>
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
