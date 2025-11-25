import Link from 'next/link';
import { Library, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#2a1515] border-t border-[#5a3030] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e descrição */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Library size={28} className="text-[#c9a961]" />
              <span className="text-xl font-bold text-[#c9a961]">
                LibraryMindxandria
              </span>
            </div>
            <p className="text-[#6b4035] max-w-md leading-relaxed text-sm">
              Uma biblioteca pública digital onde você pode explorar, ler e compartilhar conhecimento gratuitamente.
            </p>
          </div>

          {/* Links rápidos */}
          <div>
            <h3 className="text-[#c9a961] font-semibold mb-4 text-sm uppercase tracking-wider">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-[#6b4035] hover:text-[#c9a961] transition-colors text-sm flex items-center gap-2">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-[#6b4035] hover:text-[#c9a961] transition-colors text-sm flex items-center gap-2">
                  Explorar Livros
                </Link>
              </li>
              <li>
                <Link href="/upload" className="text-[#6b4035] hover:text-[#c9a961] transition-colors text-sm flex items-center gap-2">
                  Upload de Livros
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contato */}
          <div>
            <h3 className="text-[#c9a961] font-semibold mb-4 text-sm uppercase tracking-wider">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-[#6b4035] text-sm">
                <Mail size={16} className="text-[#c9a961]" />
                <span>contact.mindxandria@gmail.com</span>
              </li>
              <li className="flex items-center gap-2 text-[#6b4035] text-sm">
                <Phone size={16} className="text-[#c9a961]" />
                <span>+55 11 1234-5678</span>
              </li>
              <li className="flex items-center gap-2 text-[#6b4035] text-sm">
                <MapPin size={16} className="text-[#c9a961]" />
                <span>São Paulo, Brasil</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#5a3030] mt-8 pt-6 text-center">
          <p className="text-[#6b4035] text-sm">
            &copy; 2025 LibraryMindxandria. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

