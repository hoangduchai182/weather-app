'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';

interface SearchBarProps {
  onSearch: (city: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  // Trạng thái của ô nhập thành phố
  const [city, setCity] = useState('');
  const { t } = useApp();

  // Khi ấn nút tìm kiếm 
  // Hiển thị kết quả tìm kiếm và lưu vào lịch sử tìm kiếm
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());

      // Lưu vào lịch sử tìm kiếm
      try {
        await fetch('/api/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ city: city.trim() }),
        });
      } catch (error) {
        console.error('Không thể lưu lịch sử tìm kiếm:', error);
      }
    }
  };

  // Html của SearchBar
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto mb-8">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <svg
            className="w-5 h-5 text-white/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder={t('search')}
          className="w-full pl-12 pr-32 py-4 rounded-2xl backdrop-blur-xl bg-white/20 border border-white/30
                     focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50
                     text-white placeholder-white/60 font-medium text-lg
                     transition-all duration-200 shadow-lg"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5
                     bg-white/90 text-gray-800 rounded-xl hover:bg-white
                     transition-all duration-200 font-semibold shadow-lg
                     hover:shadow-xl hover:scale-105 cursor-pointer
                     focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          {t('searchButton')}
        </button>
      </div>
    </form>
  );
}
