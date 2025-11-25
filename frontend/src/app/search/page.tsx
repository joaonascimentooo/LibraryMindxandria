'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getAllBooks, BookResponseDTO } from '@/lib/api';
import BookCard from '@/components/BookCard';
import SearchBar from '@/components/SearchBar';
import Link from 'next/link';
import { Library } from 'lucide-react';

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-[#c9a961]">Carregando busca…</div>}>
      <SearchPageContent />
    </Suspense>
  );
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [books, setBooks] = useState<BookResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const searchTerm = searchParams.get('q') || '';

  const loadBooks = async (search: string, page: number = 0) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading books with search:', search, 'page:', page);
      const response = await getAllBooks(search || undefined, page, 20);
      console.log('Books response:', response);
      setBooks(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
      setCurrentPage(page);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar livros';
      console.error('Error loading books:', err);
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        setError('Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:8080');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks(searchTerm, 0);
  }, [searchTerm]);

  const handleSearch = (term: string) => {
    if (term.trim()) {
      router.push(`/search?q=${encodeURIComponent(term)}`);
    } else {
      router.push('/search');
    }
  };

  const handlePageChange = (newPage: number) => {
    loadBooks(searchTerm, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen">
      {/* Header de Busca */}
      <section className="bg-gradient-to-b from-[#3d1f1f] to-[#2a1515] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Link 
            href="/" 
            className="inline-flex items-center text-[#c9a961] hover:text-[#f4e8d0] mb-6 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para início
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-[#c9a961] mb-6">
            {searchTerm ? `Resultados para "${searchTerm}"` : 'Todos os Livros'}
          </h1>
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* Resultados */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Informações dos Resultados */}
          {!loading && !error && (
            <div className="mb-6 text-[#6b4035]">
              {totalElements > 0 ? (
                <p>
                  Encontrados <span className="text-[#c9a961] font-semibold">{totalElements}</span> livro{totalElements !== 1 ? 's' : ''}
                  {searchTerm && ` para "${searchTerm}"`}
                </p>
              ) : (
                <p>Nenhum livro encontrado</p>
              )}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#4a2525] border-t-[#c9a961]"></div>
              <p className="text-[#c9a961] text-xl mt-4">Carregando livros...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-20">
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 max-w-2xl mx-auto">
                <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-500 text-lg">{error}</p>
              </div>
            </div>
          )}

          {/* Resultados Vazios */}
          {!loading && !error && books.length === 0 && (
            <div className="text-center py-20">
              <Library size={64} className="text-[#6b4035] mx-auto mb-4" />
              <h2 className="text-2xl text-[#c9a961] font-bold mb-2">
                Nenhum livro encontrado
              </h2>
              <p className="text-[#6b4035] mb-6">
                {searchTerm 
                  ? 'Tente buscar com outros termos' 
                  : 'Ainda não há livros cadastrados no sistema'}
              </p>
              <Link 
                href="/upload" 
                className="inline-block bg-[#c9a961] text-[#3d1f1f] px-6 py-3 rounded-full font-semibold hover:bg-[#d4b974] hover:text-[#3d1f1f] transition-all shadow-lg"
              >
                Seja o primeiro a cadastrar
              </Link>
            </div>
          )}

          {/* Grid de Livros */}
          {!loading && !error && books.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {books.map((book) => (
                  <BookCard
                    key={book.id}
                    title={book.name}
                    author="Autor Desconhecido"
                    category={book.genreType?.[0] || 'Sem categoria'}
                    description={book.shortDescription}
                    coverImage={book.coverImageUrl}
                    readUrl={book.pdfDownloadUrl ? `/read?url=${encodeURIComponent(book.pdfDownloadUrl)}` : undefined}
                  />
                ))}
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 py-8">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="bg-[#4a2525] text-[#f4e8d0] px-6 py-3 rounded-full font-semibold hover:bg-[#c9a961] hover:text-[#3d1f1f] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#4a2525] disabled:hover:text-[#f4e8d0] min-w-[120px]"
                  >
                    ← Anterior
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[#f4e8d0] font-semibold">
                      Página {currentPage + 1} de {totalPages}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="bg-[#4a2525] text-[#f4e8d0] px-6 py-3 rounded-full font-semibold hover:bg-[#c9a961] hover:text-[#3d1f1f] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#4a2525] disabled:hover:text-[#f4e8d0] min-w-[120px]"
                  >
                    Próxima →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}

