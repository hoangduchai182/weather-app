'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'EN' | 'VI';

interface AppContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const translations = {
  EN: {
    title: 'Weather',
    subtitle: 'Real-time updates and forecasts',
    search: 'Search for a city...',
    searchButton: 'Search',
    loading: 'Loading weather data...',
    feelsLike: 'Feels Like',
    humidity: 'Humidity',
    windSpeed: 'Wind Speed',
    windDirection: 'Wind Direction',
    pressure: 'Pressure',
    cloudiness: 'Cloudiness',
    forecast5Day: '5-Day Forecast',
    forecastHourly: 'Hourly Forecast (Next 24 Hours)',
    recentSearches: 'Recent Searches',
    favorites: 'Favorite Cities',
    addToFavorites: 'Add to Favorites',
    removeFromFavorites: 'Remove from Favorites',
    clearHistory: 'Clear History',
    noSearches: 'No recent searches',
    noFavorites: 'No favorite cities yet',
    profile: 'Profile',
  },
  VI: {
    title: 'Thời Tiết',
    subtitle: 'Cập nhật và dự báo thời gian thực',
    search: 'Tìm kiếm thành phố...',
    searchButton: 'Tìm kiếm',
    loading: 'Đang tải dữ liệu thời tiết...',
    feelsLike: 'Cảm Giác Như',
    humidity: 'Độ Ẩm',
    windSpeed: 'Tốc Độ Gió',
    windDirection: 'Hướng Gió',
    pressure: 'Áp Suất',
    cloudiness: 'Mây',
    forecast5Day: 'Dự Báo 5 Ngày',
    forecastHourly: 'Dự Báo Theo Giờ (24 Giờ Tới)',
    recentSearches: 'Tìm Kiếm Gần Đây',
    favorites: 'Thành Phố Yêu Thích',
    addToFavorites: 'Thêm Yêu Thích',
    removeFromFavorites: 'Xóa Yêu Thích',
    clearHistory: 'Xóa Lịch Sử',
    noSearches: 'Chưa có tìm kiếm nào',
    noFavorites: 'Chưa có thành phố yêu thích',
    profile: 'Hồ Sơ',
  },
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('EN');
  const [mounted, setMounted] = useState(false);

  // Load language preference from localStorage
  useEffect(() => {
    const savedLanguage = (localStorage.getItem('language') as Language) || 'EN';
    setLanguage(savedLanguage);
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'EN' ? 'VI' : 'EN';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.EN] || key;
  };

  // Prevent flash of wrong content
  if (!mounted) {
    return null;
  }

  return (
    <AppContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
