'use client';
// File này là trang chính của ứng dụng, kết hợp tất cả các component và quản lý trạng thái toàn cục
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import WeatherCard from '@/components/WeatherCard';
import ForecastCard from '@/components/ForecastCard';
import SearchHistory from '@/components/SearchHistory';
import FavoritesList from '@/components/FavoritesList';
import { WeatherData, ForecastData } from '@/types/weather';
import {
  getCurrentWeather,
  getForecast,
  getCurrentWeatherByCoords,
  getForecastByCoords,
} from '@/lib/weatherApi';
import { useApp } from '@/contexts/AppContext';

// Trang chính của ứng dụng
export default function Home() {
  // Gọi các trạng thái để quản lý dữ liệu thời tiết, dự báo, tải, lỗi và làm mới danh sách yêu thích
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favoritesRefresh, setFavoritesRefresh] = useState(0);
  const { t } = useApp();

  // Lấy dữ liệu thời tiết dựa trên vị trí hiện tại của người dùng khi component được gắn vào
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            setLoading(true);
            const weatherData = await getCurrentWeatherByCoords(
              position.coords.latitude,
              position.coords.longitude
            );
            const forecastData = await getForecastByCoords(
              position.coords.latitude,
              position.coords.longitude
            );
            setWeather(weatherData);
            setForecast(forecastData);
            setError(null);
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
            setError(errorMessage);
          } finally {
            setLoading(false);
          }
        },
        () => {
          handleSearch('London');
        }
      );
    } else {
      handleSearch('London');
    }
  }, []);

  // Hàm xử lý tìm kiếm khi người dùng nhập tên thành phố
  const handleSearch = async (city: string) => {
    try {
      setLoading(true);
      setError(null);
      const weatherData = await getCurrentWeather(city);
      const forecastData = await getForecast(city);
      setWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'City not found. Please try again.';
      setError(errorMessage);
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  // Hàm để lấy gradient nền dựa trên dữ liệu thời tiết hiện tại
  const getWeatherGradient = () => {
    if (!weather) return 'from-blue-400 via-purple-400 to-pink-400';

    const temp = weather.main.temp;
    const currentTime = weather.dt; // Unix timestamp
    const sunrise = weather.sys.sunrise;
    const sunset = weather.sys.sunset;
    const condition = weather.weather[0].main.toLowerCase();

    // ƯU TIÊN 1: Kiểm tra ban đêm (Ưu tiên cao nhất)
    // Nếu thời gian hiện tại trước bình minh HOẶC sau hoàng hôn = BAN ĐÊM
    const isNight = currentTime < sunrise || currentTime > sunset;

    if (isNight) {
      // Gradient tím đậm/indigo/đen cho ban đêm
      return 'from-indigo-950 via-purple-950 to-slate-950';
    }

    // ƯU TIÊN 2: Ban ngày - Kiểm tra nhiệt độ cao (>30°C)
    if (temp > 30) {
      // Warm Orange/Red/Yellow gradient for intense heat
      return 'from-orange-500 via-red-500 to-yellow-500';
    }

    // ƯU TIÊN 3: Ban ngày - Kiểm tra nhiệt độ thấp (<10°C)
    if (temp < 10) {
      // Icy White/Pale Blue gradient for cold/winter
      return 'from-slate-200 via-blue-200 to-cyan-200';
    }

    // ƯU TIÊN 4: Ban ngày - Điều kiện thời tiết (Dự phòng cho nhiệt độ vừa phải 10-30°C)
    switch (condition) {
      case 'clear':
        return 'from-sky-400 via-blue-400 to-cyan-400';
      case 'clouds':
        return 'from-slate-400 via-gray-400 to-zinc-400';
      case 'rain':
      case 'drizzle':
        return 'from-slate-600 via-blue-600 to-indigo-600';
      case 'thunderstorm':
        return 'from-gray-700 via-slate-700 to-zinc-700';
      case 'snow':
        return 'from-blue-200 via-cyan-200 to-slate-300';
      case 'mist':
      case 'fog':
        return 'from-gray-400 via-slate-400 to-zinc-400';
      default:
        return 'from-blue-400 via-purple-400 to-pink-400';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getWeatherGradient()} py-12 px-4 relative overflow-hidden transition-all duration-1000`}>
      {/* Hiệu ứng gradient lưới động */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Navbar */}
      <Navbar />

      <div className="container mx-auto relative z-10 pt-20">
        <header className="text-center mb-12">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">{t('title')}</h1>
          <p className="text-xl md:text-2xl text-white/90 font-light">
            {t('subtitle')}
          </p>
        </header>

        <SearchBar onSearch={handleSearch} />

        <SearchHistory onCityClick={handleSearch} />
        <FavoritesList onCityClick={handleSearch} refreshTrigger={favoritesRefresh} />

        {loading && (
          <div className="text-center text-white text-xl">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-white/30 border-t-white"></div>
            <p className="mt-4 font-medium">{t('loading')}</p>
          </div>
        )}

        {error && (
          <div className="backdrop-blur-xl bg-red-500/20 border border-red-300/50 text-white px-6 py-4 rounded-2xl max-w-2xl mx-auto shadow-lg">
            {error}
          </div>
        )}

        {weather && !loading && <WeatherCard weather={weather} onFavoriteChange={() => setFavoritesRefresh(prev => prev + 1)} />}

        {forecast && !loading && <ForecastCard forecast={forecast} />}

        {!weather && !loading && !error && (
          <div className="text-center text-white text-xl backdrop-blur-md bg-white/10 p-8 rounded-2xl max-w-2xl mx-auto border border-white/20">
            Search for a city to see the weather
          </div>
        )}
      </div>

      {/* Chân trang */}
      <footer className="text-center mt-16 text-white/80 relative z-10">
        <p className="text-sm font-medium">
          Weather data provided by OpenWeatherMap
        </p>
        <p className="text-xs mt-2">
          IWS Spring 2026 - Midterm Project
        </p>
      </footer>
    </div>
  );
}
