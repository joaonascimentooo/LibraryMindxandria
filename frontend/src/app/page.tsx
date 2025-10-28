'use client';

import SearchBar from '@/components/SearchBar';
import BookCard from '@/components/BookCard';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllBooks, BookResponseDTO, getGenreStats, GenreStatDTO } from '@/lib/api';
import { GenreType, translateGenre } from '@/lib/genres';

export default function Home() {
  const router = useRouter();
  const [books, setBooks] = useState<BookResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [genreStats, setGenreStats] = useState<GenreStatDTO[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllBooks(undefined, 0, 6); // Carregar apenas 6 livros para destaque
      setBooks(response.content);
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
    loadBooks();
    // Load genre stats
    (async () => {
      try {
        setStatsLoading(true);
        const stats = await getGenreStats();
        // sort by count desc and keep top 6 for cards
        const top = stats.sort((a, b) => b.count - a.count).slice(0, 6);
        setGenreStats(top);
      } catch (e) {
        console.error('Erro ao carregar estatísticas de gêneros:', e);
      } finally {
        setStatsLoading(false);
      }
    })();
  }, []);

  const handleSearch = (term: string) => {
    if (term.trim()) {
      router.push(`/search?q=${encodeURIComponent(term)}`);
    } else {
      router.push('/search');
    }
  };

  const GENRE_ICONS: Partial<Record<GenreType, string>> = {
    ROMANCE: '💕',
    FANTASY: '🐉',
    HISTORY: '🏛️',
    SCIENCE: '🔬',
    PHILOSOPHY: '🤔',
    MYSTERY: '🕵️',
    THRILLER: '⚡',
    HORROR: '👻',
    COMEDY: '🎭',
    POETRY: '📝',
    DRAMA: '🎬',
    ACTION: '�️',
    ADVENTURE: '🧭',
    SCIENCE_FICTION: '🚀',
  };

  return (
    <>
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#1a120a] to-[#0f0a05] py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-[#c9a961] mb-6">
              Bem-vindo à LibraryMindxandria
            </h1>
            <p className="text-xl text-[#e8dcc8] mb-12 max-w-3xl mx-auto">
              Descubra milhares de livros, faça upload de suas obras e compartilhe conhecimento com o mundo
            </p>
            <SearchBar onSearch={handleSearch} />
            
            {/* Estatísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
              <div className="bg-[#1a120a] border border-[#8b6f47] rounded-lg p-6">
                <div className="text-3xl text-[#c9a961] font-bold mb-2">5,000+</div>
                <div className="text-[#8b6f47]">Livros</div>
              </div>
              <div className="bg-[#1a120a] border border-[#8b6f47] rounded-lg p-6">
                <div className="text-3xl text-[#c9a961] font-bold mb-2">2,500+</div>
                <div className="text-[#8b6f47]">Autores</div>
              </div>
              <div className="bg-[#1a120a] border border-[#8b6f47] rounded-lg p-6">
                <div className="text-3xl text-[#c9a961] font-bold mb-2">10,000+</div>
                <div className="text-[#8b6f47]">Leitores</div>
              </div>
              <div className="bg-[#1a120a] border border-[#8b6f47] rounded-lg p-6">
                <div className="text-3xl text-[#c9a961] font-bold mb-2">100%</div>
                <div className="text-[#8b6f47]">Grátis</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-[#c9a961] mb-8">Explorar por Categoria</h2>
            {statsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-[#1a120a] border border-[#4a3620] rounded-lg p-6 animate-pulse h-[140px]" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {genreStats.map((g) => {
                  const icon = GENRE_ICONS[g.genre] ?? '📚';
                  return (
                    <button
                      key={g.genre}
                      className="bg-[#1a120a] border border-[#4a3620] hover:border-[#c9a961] rounded-lg p-6 text-center transition-all hover:transform hover:scale-105 duration-300"
                      // In the future we could route to a filtered search by genre
                      onClick={() => router.push('/search')}
                    >
                      <div className="text-4xl mb-3">{icon}</div>
                      <div className="text-[#e8dcc8] font-semibold mb-1">{translateGenre(g.genre)}</div>
                      <div className="text-[#8b6f47] text-sm">{g.count} {g.count === 1 ? 'livro' : 'livros'}</div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Livros em Destaque */}
        <section className="py-16 px-4 bg-[#0f0a05]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-[#c9a961] mb-8">Livros em Destaque</h2>
            
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#8b6f47] border-t-[#c9a961]"></div>
                <p className="text-[#c9a961] text-xl mt-4">Carregando livros...</p>
              </div>
            )}
            
            {error && (
              <div className="text-center py-12">
                <div className="text-red-500 text-xl">{error}</div>
              </div>
            )}
            
            {!loading && !error && books.length === 0 && (
              <div className="text-center py-12">
                <div className="text-[#8b6f47] text-xl">Nenhum livro disponível</div>
              </div>
            )}
            
            {!loading && !error && books.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {books.map((book) => (
                    <BookCard 
                      key={book.id} 
                      title={book.name}
                      author="Autor Desconhecido"
                      category={book.genreType?.[0] || 'Sem categoria'}
                      description={book.shortDescription}
                      coverImage={book.coverImageUrl}
                    />
                  ))}
                </div>
                
                <div className="text-center mt-12">
                  <Link 
                    href="/search"
                    className="inline-block bg-[#8b6f47] text-[#e8dcc8] px-8 py-3 rounded-full font-semibold hover:bg-[#c9a961] hover:text-[#1a1108] transition-all"
                  >
                    Ver Todos os Livros
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#1a120a] to-[#2d1f0e] rounded-2xl p-12 text-center border border-[#8b6f47]">
            <h2 className="text-4xl font-bold text-[#c9a961] mb-6">
              Compartilhe Seu Conhecimento
            </h2>
            <p className="text-xl text-[#e8dcc8] mb-8">
              Faça upload dos seus livros e ajude a construir a maior biblioteca digital do Brasil
            </p>
            <Link href="/upload" className="inline-block bg-[#c9a961] text-[#1a1108] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#8b6f47] hover:text-[#e8dcc8] transition-all">
              Fazer Upload Agora
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
