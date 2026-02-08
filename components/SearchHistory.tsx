'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';

interface SearchHistoryProps {
  onCityClick: (city: string) => void;
}

interface SearchHistoryItem {
  id: number;
  city: string;
  searchedAt: string;
}

export default function SearchHistory({ onCityClick }: SearchHistoryProps) {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useApp();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/history');
        if (!res.ok) {
          console.error('Failed to fetch history:', res.statusText);
          return;
        }
        const data = await res.json();
        setHistory(data.history || []);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const clearHistory = async () => {
    try {
      await fetch('/api/history', { method: 'DELETE' });
      setHistory([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  if (loading) {
    return null;
  }

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="backdrop-blur-2xl bg-white/10 rounded-2xl shadow-xl p-6 max-w-xl mx-auto mb-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {t('recentSearches')}
        </h3>
        <button
          onClick={clearHistory}
          className="text-white/70 hover:text-white text-sm font-medium transition-colors duration-200"
        >
          {t('clearHistory')}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onCityClick(item.city)}
            className="backdrop-blur-xl bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl
                       border border-white/20 text-white font-medium transition-all duration-200
                       hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            {item.city}
          </button>
        ))}
      </div>
    </div>
  );
}
