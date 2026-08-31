'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export function SearchBar({ placeholder = 'Where to next?', className }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form 
      onSubmit={handleSearch}
      className={`w-full max-w-2xl bg-white rounded-full p-2 flex items-center shadow-lg ${className ?? ''}`}
    >
      <div className="pl-4 pr-3 text-text-light">
        <Search className="h-5 w-5" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-none focus:border-none focus:ring-0 focus:outline-none focus:ring-offset-0 shadow-none text-text placeholder:text-text-light text-base md:text-lg py-2"
        style={{ boxShadow: 'none', outline: 'none' }}
      />
      <button 
        type="submit"
        className="bg-secondary hover:bg-secondary-dark transition-colors text-white font-medium rounded-full px-5 md:px-8 py-2.5 shrink-0"
      >
        Search
      </button>
    </form>
  );
}
