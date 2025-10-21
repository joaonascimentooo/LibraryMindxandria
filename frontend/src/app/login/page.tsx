"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/lib/api";
import { setTokens } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Informe email e senha.");
      return;
    }

    try {
      setLoading(true);
      const tokens = await loginUser({ email, password });
      setTokens(tokens.accessToken, tokens.refreshToken);
      router.push("/");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Falha ao entrar.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0f0a05] text-[#e8dcc8]">
      <div className="max-w-md mx-auto pt-16 px-4">
        <h1 className="text-3xl font-bold text-[#c9a961] mb-2">Entrar</h1>
        <p className="text-sm text-[#cbbba2] mb-6">
          Não tem conta? <Link className="text-[#c9a961] underline" href="/register">Cadastre-se</Link>
        </p>

        <form onSubmit={handleSubmit} className="bg-[#1a120a] border border-[#8b6f47] rounded-xl p-6 space-y-4 shadow-lg">
          {error && (
            <div className="bg-red-900/40 border border-red-700 text-red-200 px-3 py-2 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#2a1e13] border border-[#8b6f47] text-[#e8dcc8] focus:outline-none focus:ring-2 focus:ring-[#c9a961]"
              placeholder="voce@exemplo.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1" htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#2a1e13] border border-[#8b6f47] text-[#e8dcc8] focus:outline-none focus:ring-2 focus:ring-[#c9a961]"
              placeholder="Sua senha"
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c9a961] text-[#1a1108] py-2 rounded font-semibold hover:bg-[#8b6f47] hover:text-[#e8dcc8] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
