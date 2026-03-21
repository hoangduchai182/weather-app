'use client';

import { WeatherData } from '@/types/weather';
import { getWeatherIcon, getWindDirection, formatTemp, formatWindSpeed, formatDewPoint } from '@/lib/utils';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';

interface WeatherCardProps {
  weather: WeatherData;                   // Dữ liệu thời tiết hiện tại
  onFavoriteChange?: () => void;          // Callback khi trạng thái yêu thích thay đổi (để cập nhật giao diện)
}

export default function WeatherCard({ weather, onFavoriteChange }: WeatherCardProps) {
  // Trạng thái lưu trữ xem thành phố này đã được theo dõi/yêu thích chưa
  const [isFavorite, setIsFavorite] = useState(false);
  // Trạng thái loading khi đang call API thêm/bớt yêu thích
  const [loading, setLoading] = useState(false);
  // Lấy hàm dịch (t) và đơn vị nhiệt độ (C/F) (unit) từ context chung
  const { t, unit } = useApp();

  // Kiểm tra xem thành phố hiện tại có nằm trong danh sách yêu thích hay không (khi component mount hoặc khi đổi thành phố)
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        // Gọi API tới database để lấy danh sách yêu thích
        const res = await fetch('/api/favorites');
        if (!res.ok) return;
        const { favorites } = await res.json();
        setIsFavorite(favorites.some((fav: { city: string }) => fav.city === weather.name));
      } catch (error) {
        console.error('Không thể kiểm tra trạng thái yêu thích:', error);
      }
    };

    checkFavoriteStatus();
  }, [weather.name]);

  // Hàm này sử dung để thêm hoặc xóa thành phố khỏi danh sách yêu thích
  const toggleFavorite = async () => {
    setLoading(true);
    try {
      if (isFavorite) {
        // Xóa khỏi danh sách yêu thích
        const res = await fetch(`/api/favorites?city=${encodeURIComponent(weather.name)}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setIsFavorite(false);
          onFavoriteChange?.();
        }
      } else {
        // Thêm vào danh sách yêu thích
        const res = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ city: weather.name }),
        });
        if (res.ok) {
          setIsFavorite(true);
          onFavoriteChange?.();
        }
      }
    } catch (error) {
      console.error('Không thể thay đổi trạng thái yêu thích:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="backdrop-blur-2xl bg-white/10 rounded-3xl shadow-2xl p-8 md:p-10 w-full max-w-3xl lg:max-w-none mx-auto border border-white/20 hover:bg-white/15 transition-all duration-300 relative h-full flex flex-col justify-center">
      {/* Nút thêm vào yêu thích */}
      <button
        onClick={toggleFavorite}
        disabled={loading}
        className="absolute top-6 right-6 z-10 backdrop-blur-xl bg-white/10 hover:bg-white/20
                   p-3 rounded-xl border border-white/20 transition-all duration-200
                   hover:scale-110 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50
                   disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
        title={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
      >
        <svg
          className={`w-6 h-6 transition-colors duration-200 ${isFavorite ? 'fill-red-400 stroke-red-400' : 'fill-none stroke-white'
            }`}
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      {/* Tên thành phố và Mô tả thời tiết */}
      <div className="text-center mb-4">
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
          {weather.name}, {weather.sys.country}
        </h2>
        <p className="text-white/80 mt-3 capitalize text-xl md:text-2xl font-light">
          {weather.weather[0].description}
        </p>
      </div>

      {/* Hiển thị Icon thời tiết siêu lớn và nhiệt độ hiện tại */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-4">
        <div className="relative">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl"></div>
          <Image
            src={getWeatherIcon(weather.weather[0].icon)}
            alt={weather.weather[0].description}
            width={120}
            height={120}
            className="relative z-10 drop-shadow-2xl"
          />
        </div>
        <div className="text-5xl md:text-6xl font-bold text-white drop-shadow-2xl">
          {formatTemp(weather.main.temp, unit)}
        </div>
      </div>

      {/* Box lưới phụ hiển thị Cảm giác như, Độ ẩm, Tốc gió, Hướng gió..v.v.. */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        <div className="backdrop-blur-xl bg-white/10 p-3 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-200">
          <p className="text-white/70 text-sm font-medium mb-1">{t('feelsLike')}</p>
          <p className="text-md font-bold text-white">
            {formatTemp(weather.main.feels_like, unit)}
          </p>
        </div>

        <div className="backdrop-blur-xl bg-white/10 p-3 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-200">
          <p className="text-white/70 text-sm font-medium mb-1">{unit === 'F' ? t('dewPoint') : t('humidity')}</p>
          <p className="text-md font-bold text-white">
            {unit === 'F' ? formatDewPoint(weather.main.temp, weather.main.humidity, unit) : `${weather.main.humidity}%`}
          </p>
        </div>

        <div className="backdrop-blur-xl bg-white/10 p-3 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-200">
          <p className="text-white/70 text-sm font-medium mb-1">{t('windSpeed')}</p>
          <p className="text-md font-bold text-white">
            {formatWindSpeed(weather.wind.speed, unit)}
          </p>
        </div>

        <div className="backdrop-blur-xl bg-white/10 p-3 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-200">
          <p className="text-white/70 text-sm font-medium mb-1">{t('windDirection')}</p>
          <p className="text-md font-bold text-white">
            {getWindDirection(weather.wind.deg)}
          </p>
        </div>

        <div className="backdrop-blur-xl bg-white/10 p-3 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-200">
          <p className="text-white/70 text-sm font-medium mb-1">{t('pressure')}</p>
          <p className="text-md font-bold text-white">
            {weather.main.pressure} hPa
          </p>
        </div>

        <div className="backdrop-blur-xl bg-white/10 p-3 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-200">
          <p className="text-white/70 text-sm font-medium mb-1">{t('cloudiness')}</p>
          <p className="text-md font-bold text-white">
            {weather.clouds.all}%
          </p>
        </div>
      </div>
    </div>
  );
}
