'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen, Settings, LogOut, Menu, X } from 'lucide-react';

function formatName(name: string | undefined): string {
  if (!name) return 'Usuário';
  return name
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-[#3d1f1f] border-b border-[#5a3030] sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-14">
          <Link href="/" className="flex items-center space-x-3">
            <BookOpen size={28} className="text-[#c9a961]" />
            <span className="text-xl font-semibold text-[#c9a961]">
              LibraryMindxandria
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              href="/" 
              className="text-[#f4e8d0] hover:bg-[#4a2525] px-3 py-2 rounded-md transition-colors text-sm font-medium"
            >
              Home
            </Link>
            <Link 
              href="/search" 
              className="text-[#f4e8d0] hover:bg-[#4a2525] px-3 py-2 rounded-md transition-colors text-sm font-medium"
            >
              Explorar Livros
            </Link>
            <Link 
              href="/upload" 
              className="text-[#f4e8d0] hover:bg-[#4a2525] px-3 py-2 rounded-md transition-colors text-sm font-medium"
            >
              Upload
            </Link>
            <Link 
              href="/upload/bulk" 
              className="text-[#f4e8d0] hover:bg-[#4a2525] px-3 py-2 rounded-md transition-colors text-sm font-medium"
            >
              Upload em Lote
            </Link>

            <div className="w-px h-6 bg-[#c9a961] mx-2"></div>
            <div className="w-px h-6 bg-[#b5a642] mx-2"></div>

            {/* Auth Section */}
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-[#4a2525] animate-pulse"></div>
            ) : isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-1 hover:bg-[#4a2525] px-2 py-1.5 rounded-md transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a961] to-[#6b4035] flex items-center justify-center text-[#1a1410] font-semibold text-sm">
                    {formatName(user?.name)?.[0]?.toUpperCase() || "U"}
                  </div>
                  <svg className="w-3.5 h-3.5 text-[#c9a961]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#3d1f1f] border border-[#c9a961] rounded-lg shadow-lg py-2 z-50">
                    <Link
                      href="/my-books"
                      className="flex items-center gap-2 px-4 py-2 text-[#f4e8d0] hover:bg-[#4a2525] hover:text-[#c9a961] transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <BookOpen size={16} />
                      Meus Livros
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-[#f4e8d0] hover:bg-[#5c4033] hover:text-[#d4af37] transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings size={16} />
                      Configurar Perfil
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2 text-left px-4 py-2 text-[#f4e8d0] hover:bg-[#5c4033] hover:text-red-400 transition-colors"
                    >
                      <LogOut size={16} />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-[#f4e8d0] hover:bg-[#4a2525] px-3 py-2 rounded-md transition-colors text-sm font-medium"
                >
                  Entrar
                </Link>
                <Link 
                  href="/register" 
                  className="bg-[#c9a961] text-[#1a1410] px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#6b4035] transition-all ml-2"
                >
                  Cadastrar-se
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-[#d4af37] p-2"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link 
              href="/" 
              className="block text-[#e8dcc8] hover:text-[#c9a961] transition-colors font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/search" 
              className="block text-[#e8dcc8] hover:text-[#c9a961] transition-colors font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Explorar Livros
            </Link>
            <Link 
              href="/upload" 
              className="block text-[#e8dcc8] hover:text-[#c9a961] transition-colors font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Upload
            </Link>
            <Link 
              href="/upload/bulk" 
              className="block text-[#e8dcc8] hover:text-[#c9a961] transition-colors font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Upload em Lote
            </Link>

            {/* Mobile Auth Section */}
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <div className="border-t border-[#b5a642] pt-4 space-y-2">
                    <div className="flex items-center space-x-3 px-2 py-2">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b5a642] flex items-center justify-center text-[#1a1410] font-semibold text-sm shadow-md">
                        {formatName(user?.name)?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="text-[#f4e8d0] font-medium text-sm">{formatName(user?.name)}</p>
                      </div>
                    </div>
                    <Link
                      href="/my-books"
                      className="flex items-center gap-2 text-[#f4e8d0] hover:text-[#d4af37] transition-colors font-medium py-2 px-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <BookOpen size={16} />
                      Meus Livros
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 text-[#f4e8d0] hover:text-[#d4af37] transition-colors font-medium py-2 px-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings size={16} />
                      Configurar Perfil
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 text-left text-[#f4e8d0] hover:text-red-400 transition-colors font-medium py-2 px-2"
                    >
                      <LogOut size={16} />
                      Sair
                    </button>
                  </div>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      className="block text-[#e8dcc8] hover:text-[#c9a961] transition-colors font-medium py-2"
                    >
                      Entrar
                    </Link>
                    <Link 
                      href="/register" 
                      className="block w-full text-center bg-[#c9a961] text-[#1a1108] px-6 py-2 rounded-full font-semibold hover:bg-[#6b4035] hover:text-[#e8dcc8] transition-all"
                    >
                      Cadastrar-se
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

