'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_URL } from '@/lib/api';
import PDFViewer from '@/components/PDFViewer';

export default function ReadPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-[#c9a961]">Carregando leitor…</div>}>
      <ReaderContent />
    </Suspense>
  );
}

function isSafeUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function normalizePdfUrl(original: string): string | null {
  try {
    const u = new URL(original);
    // If pointing to localhost without an explicit port, borrow port from API_URL (defaults 8080)
    if ((u.hostname === 'localhost' || u.hostname === '127.0.0.1') && !u.port) {
      try {
        const api = new URL(API_URL);
        if ((api.hostname === 'localhost' || api.hostname === '127.0.0.1') && api.port) {
          u.port = api.port;
        }
      } catch {}
    }
    return u.toString();
  } catch {
    return null;
  }
}

function ReaderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawUrl = searchParams.get('url');
  const normalized = rawUrl ? normalizePdfUrl(rawUrl) : null;
  const isValid = normalized ? isSafeUrl(normalized) : false;
  const proxied = normalized ? `/api/file-proxy?url=${encodeURIComponent(normalized)}` : null;

  if (!proxied || !isValid) {
    return (
      <main className="min-h-screen bg-[#0f0a05] text-[#e8dcc8]">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <Link href="/" className="text-[#c9a961] hover:underline">← Voltar</Link>
          <h1 className="text-3xl font-bold text-red-400 mt-6">PDF inválido ou não fornecido</h1>
          <p className="text-[#cbbba2] mt-2">Tente abrir a partir de um livro com PDF disponível.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f0a05] text-[#e8dcc8]">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-[#1a120a] border-b border-[#8b6f47]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            onClick={() => router.back()}
            className="text-[#c9a961] hover:text-[#e8dcc8]"
            aria-label="Voltar"
          >
            ← Voltar
          </button>
          <div className="truncate text-[#c9a961]">Leitor de PDF</div>
          <a
            href={proxied}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#c9a961] text-[#1a1108] px-4 py-1.5 rounded-full font-semibold hover:bg-[#8b6f47] hover:text-[#e8dcc8] transition-colors"
          >
            Baixar
          </a>
        </div>
      </div>

      {/* PDF area */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <PDFViewer url={proxied} />
      </div>
    </main>
  );
}
