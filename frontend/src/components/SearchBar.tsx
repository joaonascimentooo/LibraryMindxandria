'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onSearch?: (searchTerm: string) => void;
  delay?: number;
}

export default function SearchBar({ onSearch, delay = 0 }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSearch} 
      className="w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: [0.25, 0.4, 0.25, 1]
      }}
    >
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Pesquisar livros, autores, categorias..."
          className="w-full px-6 py-4 pr-12 rounded-full bg-[#3d1f1f] border-2 border-[#4a2525] text-[#f4e8d0] placeholder-[#6b4035] focus:outline-none focus:border-[#c9a961] transition-colors"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#c9a961] text-[#3d1f1f] p-3 rounded-full hover:bg-[#6b4035] hover:text-[#f4e8d0] transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </motion.form>
  );
}

