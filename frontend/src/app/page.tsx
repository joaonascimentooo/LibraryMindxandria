import SearchBar from '@/components/SearchBar';
import BookCard from '@/components/BookCard';

export default function Home() {
  const featuredBooks = [
    {
      title: "1984",
      author: "George Orwell",
      category: "Ficção",
      description: "Um romance distópico sobre vigilância, controle governamental e manipulação da verdade."
    },
    {
      title: "Dom Casmurro",
      author: "Machado de Assis",
      category: "Romance",
      description: "A história de Bentinho e Capitu, um dos maiores clássicos da literatura brasileira."
    },
    {
      title: "O Pequeno Príncipe",
      author: "Antoine de Saint-Exupéry",
      category: "Fantasia",
      description: "Uma fábula poética sobre amor, amizade e a essência da vida humana."
    },
    {
      title: "Sapiens",
      author: "Yuval Noah Harari",
      category: "História",
      description: "Uma breve história da humanidade desde a Idade da Pedra até a era moderna."
    },
    {
      title: "O Senhor dos Anéis",
      author: "J.R.R. Tolkien",
      category: "Fantasia",
      description: "A jornada épica de Frodo para destruir o Um Anel e salvar a Terra-média."
    },
    {
      title: "Cem Anos de Solidão",
      author: "Gabriel García Márquez",
      category: "Romance",
      description: "A saga da família Buendía através de várias gerações em Macondo."
    },
  ];

  const categories = [
    { name: "Romance", icon: "💕", count: 1250 },
    { name: "Ficção", icon: "🌟", count: 980 },
    { name: "História", icon: "🏛️", count: 756 },
    { name: "Fantasia", icon: "🐉", count: 642 },
    { name: "Ciência", icon: "🔬", count: 534 },
    { name: "Filosofia", icon: "🤔", count: 421 },
  ];

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
            <SearchBar />
            
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

        {/* Categorias */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-[#c9a961] mb-8">Explorar por Categoria</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <button
                  key={category.name}
                  className="bg-[#1a120a] border border-[#4a3620] hover:border-[#c9a961] rounded-lg p-6 text-center transition-all hover:transform hover:scale-105 duration-300"
                >
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <div className="text-[#e8dcc8] font-semibold mb-1">{category.name}</div>
                  <div className="text-[#8b6f47] text-sm">{category.count} livros</div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Livros em Destaque */}
        <section className="py-16 px-4 bg-[#0f0a05]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-[#c9a961] mb-8">Livros em Destaque</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBooks.map((book, index) => (
                <BookCard key={index} {...book} />
              ))}
            </div>
            <div className="text-center mt-12">
              <button className="bg-[#8b6f47] text-[#e8dcc8] px-8 py-3 rounded-full font-semibold hover:bg-[#c9a961] hover:text-[#1a1108] transition-all">
                Ver Todos os Livros
              </button>
            </div>
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
            <button className="bg-[#c9a961] text-[#1a1108] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#8b6f47] hover:text-[#e8dcc8] transition-all">
              Fazer Upload Agora
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
