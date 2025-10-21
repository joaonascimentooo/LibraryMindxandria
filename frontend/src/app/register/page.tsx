"use client";

import { useState } from "react";
import Link from "next/link";
import { registerUser } from "@/lib/api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Preencha todos os campos.");
      return;
    }

    if (password.length < 8) {
      setError("A senha deve ter no mínimo 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);
      await registerUser({ name, email, password });

      setSuccess("Cadastro realizado com sucesso! Você já pode fazer login.");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro inesperado ao registrar.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0f0a05] text-[#e8dcc8]">
      <div className="max-w-md mx-auto pt-16 px-4">
        <h1 className="text-3xl font-bold text-[#c9a961] mb-2">Criar conta</h1>
        <p className="text-sm text-[#cbbba2] mb-6">
          Já tem conta? <Link className="text-[#c9a961] underline" href="/login">Acesse aqui</Link>
        </p>

        <form onSubmit={handleSubmit} className="bg-[#1a120a] border border-[#8b6f47] rounded-xl p-6 space-y-4 shadow-lg">
          {error && (
            <div className="bg-red-900/40 border border-red-700 text-red-200 px-3 py-2 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-900/30 border border-green-700 text-green-200 px-3 py-2 rounded">
              {success}
            </div>
          )}

          <div>
            <label className="block text-sm mb-1" htmlFor="name">Nome</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#2a1e13] border border-[#8b6f47] text-[#e8dcc8] focus:outline-none focus:ring-2 focus:ring-[#c9a961]"
              placeholder="Seu nome"
              required
              minLength={3}
            />
          </div>

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
              placeholder="Mínimo 8 caracteres"
              required
              minLength={8}
            />
          </div>

          <div>
            <label className="block text-sm mb-1" htmlFor="confirmPassword">Confirmar senha</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#2a1e13] border border-[#8b6f47] text-[#e8dcc8] focus:outline-none focus:ring-2 focus:ring-[#c9a961]"
              placeholder="Repita a senha"
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c9a961] text-[#1a1108] py-2 rounded font-semibold hover:bg-[#8b6f47] hover:text-[#e8dcc8] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Enviando..." : "Cadastrar"}
          </button>
        </form>

        <p className="text-xs text-[#9b8c78] mt-4">
          Ao criar sua conta, você concorda com nossos termos de uso e política de privacidade.
        </p>
      </div>
    </main>
  );
}
