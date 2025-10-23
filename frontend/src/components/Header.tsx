'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';

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
    <header className="bg-[#1a120a] border-b border-[#8b6f47] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-3xl">📚</div>
            <span className="text-2xl font-bold text-[#c9a961]">
              LibraryMindxandria
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-[#e8dcc8] hover:text-[#c9a961] transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              href="/books" 
              className="text-[#e8dcc8] hover:text-[#c9a961] transition-colors font-medium"
            >
              Explorar Livros
            </Link>
            <Link 
              href="/upload" 
              className="text-[#e8dcc8] hover:text-[#c9a961] transition-colors font-medium"
            >
              Upload
            </Link>

            {/* Auth Section */}
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-[#2a1e13] animate-pulse"></div>
            ) : isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 bg-[#2a1e13] hover:bg-[#3a2e23] px-3 py-1.5 rounded-full transition-colors border border-[#8b6f47]"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#c9a961] to-[#8b6f47] flex items-center justify-center text-[#1a1108] font-semibold text-sm shadow-md">
                    {formatName(user?.name)?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="text-[#e8dcc8] font-medium text-sm">{formatName(user?.name)}</span>
                  <svg className="w-3.5 h-3.5 text-[#c9a961]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1a120a] border border-[#8b6f47] rounded-lg shadow-lg py-2 z-50">
                    <Link
                      href="/my-books"
                      className="block px-4 py-2 text-[#e8dcc8] hover:bg-[#2a1e13] hover:text-[#c9a961] transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      📚 Meus Livros
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-[#e8dcc8] hover:bg-[#2a1e13] hover:text-[#c9a961] transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      ⚙️ Configurar Perfil
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-[#e8dcc8] hover:bg-[#2a1e13] hover:text-red-400 transition-colors"
                    >
                      🚪 Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-[#e8dcc8] hover:text-[#c9a961] transition-colors font-medium"
                >
                  Entrar
                </Link>
                <Link 
                  href="/register" 
                  className="bg-[#c9a961] text-[#1a1108] px-6 py-2 rounded-full font-semibold hover:bg-[#8b6f47] hover:text-[#e8dcc8] transition-all"
                >
                  Cadastrar-se
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-[#c9a961] p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link 
              href="/" 
              className="block text-[#e8dcc8] hover:text-[#c9a961] transition-colors font-medium py-2"
            >
              Home
            </Link>
            <Link 
              href="/books" 
              className="block text-[#e8dcc8] hover:text-[#c9a961] transition-colors font-medium py-2"
            >
              Explorar Livros
            </Link>
            <Link 
              href="/upload" 
              className="block text-[#e8dcc8] hover:text-[#c9a961] transition-colors font-medium py-2"
            >
              Upload
            </Link>

            {/* Mobile Auth Section */}
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <div className="border-t border-[#8b6f47] pt-4 space-y-2">
                    <div className="flex items-center space-x-3 px-2 py-2">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#c9a961] to-[#8b6f47] flex items-center justify-center text-[#1a1108] font-semibold text-sm shadow-md">
                        {formatName(user?.name)?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="text-[#e8dcc8] font-medium text-sm">{formatName(user?.name)}</p>
                      </div>
                    </div>
                    <Link
                      href="/my-books"
                      className="block text-[#e8dcc8] hover:text-[#c9a961] transition-colors font-medium py-2 px-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      📚 Meus Livros
                    </Link>
                    <Link
                      href="/profile"
                      className="block text-[#e8dcc8] hover:text-[#c9a961] transition-colors font-medium py-2 px-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ⚙️ Configurar Perfil
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left text-[#e8dcc8] hover:text-red-400 transition-colors font-medium py-2 px-2"
                    >
                      🚪 Sair
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
                      className="block w-full text-center bg-[#c9a961] text-[#1a1108] px-6 py-2 rounded-full font-semibold hover:bg-[#8b6f47] hover:text-[#e8dcc8] transition-all"
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
