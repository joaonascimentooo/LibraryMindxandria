import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0f0a05] border-t border-[#4a3620] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e descrição */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-3xl">📚</div>
              <span className="text-2xl font-bold text-[#c9a961]">
                LibraryMindxandria
              </span>
            </div>
            <p className="text-[#8b6f47] max-w-md leading-relaxed">
              Uma biblioteca pública digital onde você pode explorar, ler e compartilhar conhecimento gratuitamente.
            </p>
          </div>

          {/* Links rápidos */}
          <div>
            <h3 className="text-[#c9a961] font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-[#8b6f47] hover:text-[#c9a961] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/books" className="text-[#8b6f47] hover:text-[#c9a961] transition-colors">
                  Explorar Livros
                </Link>
              </li>
              <li>
                <Link href="/upload" className="text-[#8b6f47] hover:text-[#c9a961] transition-colors">
                  Upload de Livros
                </Link>
              </li>
            </ul>
          </div>
          {/* Contato */}
          <div>
            <h3 className="text-[#c9a961] font-bold mb-4">Contato</h3>
            <ul className="space-y-2 text-[#8b6f47]">
              <li>📧contact.mindxandria@gmail.com</li>
              <li>📞 +55 11 1234-5678</li>
              <li>📍 São Paulo, Brasil</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#4a3620] mt-8 pt-8 text-center text-[#8b6f47]">
          <p>&copy; 2025 LibraryMindxandria. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
