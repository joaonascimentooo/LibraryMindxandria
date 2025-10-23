'use client';

import { useState } from 'react';

interface SearchBarProps {
  onSearch?: (searchTerm: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Pesquisar livros, autores, categorias..."
          className="w-full px-6 py-4 pr-12 rounded-full bg-[#1a120a] border-2 border-[#8b6f47] text-[#e8dcc8] placeholder-[#8b6f47] focus:outline-none focus:border-[#c9a961] transition-colors"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#c9a961] text-[#1a1108] p-3 rounded-full hover:bg-[#8b6f47] hover:text-[#e8dcc8] transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </form>
  );
}
