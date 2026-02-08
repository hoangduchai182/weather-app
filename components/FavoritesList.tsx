'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';

interface FavoritesListProps {
  onCityClick: (city: string) => void;
  refreshTrigger?: number;
}

interface Favorite {
  id: number;
  city: string;
  notes: string | null;
  addedAt: string;
}

export default function FavoritesList({ onCityClick, refreshTrigger }: FavoritesListProps) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useApp();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch('/api/favorites');
        if (!res.ok) {
          console.error('Failed to fetch favorites:', res.statusText);
          return;
        }
        const data = await res.json();
        setFavorites(data.favorites || []);
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [refreshTrigger]);

  const removeFavorite = async (city: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/favorites?city=${encodeURIComponent(city)}`, {
        method: 'DELETE',
      });
      setFavorites(favorites.filter((fav) => fav.city !== city));
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  if (loading) {
    return null;
  }

  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className="backdrop-blur-2xl bg-white/10 rounded-2xl shadow-xl p-6 max-w-xl mx-auto mb-8 border border-white/20">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 fill-red-400 stroke-red-400" viewBox="0 0 24 24" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        {t('favorites')}
      </h3>
      <div className="space-y-2">
        {favorites.map((favorite) => (
          <div
            key={favorite.id}
            onClick={() => onCityClick(favorite.city)}
            className="backdrop-blur-xl bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl
                       border border-white/20 transition-all duration-200 cursor-pointer
                       flex items-center justify-between group"
          >
            <span className="text-white font-medium">{favorite.city}</span>
            <button
              onClick={(e) => removeFavorite(favorite.city, e)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200
                         text-red-400 hover:text-red-300 p-1"
              aria-label="Remove from favorites"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
