'use client';

import SearchBar from '@/components/SearchBar';
import BookCard from '@/components/BookCard';
import SplitText from '@/components/SplitText';
import ScrollReveal from '@/components/ScrollReveal';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllBooks, BookResponseDTO, getGenreStats, GenreStatDTO } from '@/lib/api';
import { GenreType, translateGenre } from '@/lib/genres';
import { Heart, Sparkles, Landmark, Microscope, Brain, Search as SearchIcon, Zap, Ghost, Laugh, PenTool, Drama, Sword, Compass, Rocket, Library, BookOpen, Users, Eye, Gift } from 'lucide-react';

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

  const GENRE_ICONS: Partial<Record<GenreType, React.ReactNode>> = {
    ROMANCE: <Heart size={32} className="mx-auto" />,
    FANTASY: <Sparkles size={32} className="mx-auto" />,
    HISTORY: <Landmark size={32} className="mx-auto" />,
    SCIENCE: <Microscope size={32} className="mx-auto" />,
    PHILOSOPHY: <Brain size={32} className="mx-auto" />,
    MYSTERY: <SearchIcon size={32} className="mx-auto" />,
    THRILLER: <Zap size={32} className="mx-auto" />,
    HORROR: <Ghost size={32} className="mx-auto" />,
    COMEDY: <Laugh size={32} className="mx-auto" />,
    POETRY: <PenTool size={32} className="mx-auto" />,
    DRAMA: <Drama size={32} className="mx-auto" />,
    ACTION: <Sword size={32} className="mx-auto" />,
    ADVENTURE: <Compass size={32} className="mx-auto" />,
    SCIENCE_FICTION: <Rocket size={32} className="mx-auto" />,
  };

  return (
    <>
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#3d1f1f] to-[#2a1515] py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <SplitText 
              text="Bem-vindo à LibraryMindxandria"
              className="text-5xl md:text-6xl font-bold text-[#c9a961] mb-6"
              as="h1"
            />
            <SplitText 
              text="Descubra milhares de livros, faça upload de suas obras e compartilhe conhecimento com o mundo"
              className="text-xl text-[#f4e8d0] mb-12 max-w-3xl mx-auto"
              as="p"
              delay={0.5}
            />
            <SearchBar onSearch={handleSearch} delay={1.2} />
            
            {/* Estatísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
              <ScrollReveal delay={0.1}>
                <div className="group bg-[#3d1f1f] border border-[#4a2525] rounded-lg p-6 transition-all duration-300 hover:border-[#c9a961] hover:shadow-lg hover:shadow-[#c9a961]/20 hover:-translate-y-1 cursor-default">
                  <div className="flex justify-center mb-3">
                    <BookOpen size={32} className="text-[#6b4035] group-hover:text-[#c9a961] transition-colors" />
                  </div>
                  <div className="text-3xl text-[#c9a961] font-bold mb-2">5,000+</div>
                  <div className="text-[#6b4035] group-hover:text-[#f4e8d0] transition-colors">Livros</div>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <div className="group bg-[#3d1f1f] border border-[#4a2525] rounded-lg p-6 transition-all duration-300 hover:border-[#c9a961] hover:shadow-lg hover:shadow-[#c9a961]/20 hover:-translate-y-1 cursor-default">
                  <div className="flex justify-center mb-3">
                    <Users size={32} className="text-[#6b4035] group-hover:text-[#c9a961] transition-colors" />
                  </div>
                  <div className="text-3xl text-[#c9a961] font-bold mb-2">2,500+</div>
                  <div className="text-[#6b4035] group-hover:text-[#f4e8d0] transition-colors">Autores</div>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.3}>
                <div className="group bg-[#3d1f1f] border border-[#4a2525] rounded-lg p-6 transition-all duration-300 hover:border-[#c9a961] hover:shadow-lg hover:shadow-[#c9a961]/20 hover:-translate-y-1 cursor-default">
                  <div className="flex justify-center mb-3">
                    <Eye size={32} className="text-[#6b4035] group-hover:text-[#c9a961] transition-colors" />
                  </div>
                  <div className="text-3xl text-[#c9a961] font-bold mb-2">10,000+</div>
                  <div className="text-[#6b4035] group-hover:text-[#f4e8d0] transition-colors">Leitores</div>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.4}>
                <div className="group bg-[#3d1f1f] border border-[#4a2525] rounded-lg p-6 transition-all duration-300 hover:border-[#c9a961] hover:shadow-lg hover:shadow-[#c9a961]/20 hover:-translate-y-1 cursor-default">
                  <div className="flex justify-center mb-3">
                    <Gift size={32} className="text-[#6b4035] group-hover:text-[#c9a961] transition-colors" />
                  </div>
                  <div className="text-3xl text-[#c9a961] font-bold mb-2">100%</div>
                  <div className="text-[#6b4035] group-hover:text-[#f4e8d0] transition-colors">Grátis</div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <ScrollReveal>
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-[#c9a961] mb-8">Explorar por Categoria</h2>
            {statsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-[#3d1f1f] border border-[#4a2525] rounded-lg p-6 animate-pulse h-[140px]" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {genreStats.map((g) => {
                  const icon = GENRE_ICONS[g.genre] ?? <Library size={32} className="mx-auto" />;
                  return (
                    <button
                      key={g.genre}
                      className="bg-[#3d1f1f] border border-[#4a2525] hover:border-[#c9a961] rounded-lg p-6 text-center transition-all hover:transform hover:scale-105 duration-300"
                      // In the future we could route to a filtered search by genre
                      onClick={() => router.push('/search')}
                    >
                      <div className="text-[#c9a961] mb-3">{icon}</div>
                      <div className="text-[#f4e8d0] font-semibold mb-1">{translateGenre(g.genre)}</div>
                      <div className="text-[#6b4035] text-sm">{g.count} {g.count === 1 ? 'livro' : 'livros'}</div>
                    </button>
                  );
                })}
              </div>
            )}
            </div>
          </section>
        </ScrollReveal>

        {/* Livros em Destaque */}
        <ScrollReveal>
          <section className="py-16 px-4 bg-[#2a1515]">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-[#c9a961] mb-8">Livros em Destaque</h2>
            
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#4a2525] border-t-[#c9a961]"></div>
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
                <div className="text-[#6b4035] text-xl">Nenhum livro disponível</div>
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
                      readUrl={book.pdfDownloadUrl ? `/read?url=${encodeURIComponent(book.pdfDownloadUrl)}` : undefined}
                    />
                  ))}
                </div>
                
                <div className="text-center mt-12">
                  <Link 
                    href="/search"
                    className="inline-block bg-[#4a2525] text-[#f4e8d0] px-8 py-3 rounded-full font-semibold hover:bg-[#c9a961] hover:text-[#3d1f1f] transition-all"
                  >
                    Ver Todos os Livros
                  </Link>
                </div>
              </>
            )}
            </div>
          </section>
        </ScrollReveal>

        {/* Call to Action */}
        <ScrollReveal>
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#3d1f1f] to-[#2a1515] rounded-2xl p-12 text-center border border-[#4a2525]">
            <h2 className="text-4xl font-bold text-[#c9a961] mb-6">
              Compartilhe Seu Conhecimento
            </h2>
            <p className="text-xl text-[#f4e8d0] mb-8">
              Faça upload dos seus livros e ajude a construir a maior biblioteca digital do Brasil
            </p>
            <Link href="/upload" className="inline-block bg-[#c9a961] text-[#3d1f1f] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#d4b974] hover:text-[#3d1f1f] transition-all shadow-lg hover:shadow-xl">
              Fazer Upload Agora
            </Link>
            </div>
          </section>
        </ScrollReveal>
      </main>
    </>
  );
}

