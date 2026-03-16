'use client';

// File này dùng để tạo ngữ cảnh ứng dụng quản lý ngôn ngữ, dịch thuật và các thiết lập chung khác
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Định nghĩa các ngôn ngữ được hỗ trợ
type Language = 'EN' | 'VI' | 'JA' | 'KO' | 'ZH';
// Định nghĩa đơn vị nhiệt độ: C (độ C) hoặc F (độ F)
type TempUnit = 'C' | 'F';

// Kiểu dữ liệu cho toàn bộ Context của ứng dụng
interface AppContextType {
  language: Language;                   // Ngôn ngữ hiện tại
  toggleLanguage: () => void;           // Hàm đổi ngôn ngữ
  unit: TempUnit;                       // Đơn vị nhiệt độ hiện tại
  toggleUnit: () => void;               // Hàm đổi đơn vị nhiệt độ
  t: (key: string) => string;           // Hàm dịch văn bản (dựa theo key)
}

// Khởi tạo Context với giá trị mặc định là undefined
const AppContext = createContext<AppContextType | undefined>(undefined);

// Đối tượng chứa các bản dịch cho từng ngôn ngữ
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
  JA: {
    title: '天気',
    subtitle: 'リアルタイムの更新と予報',
    search: '都市を検索...',
    searchButton: '検索',
    loading: '気象データを読み込み中...',
    feelsLike: '体感温度',
    humidity: '湿度',
    windSpeed: '風速',
    windDirection: '風向',
    pressure: '気圧',
    cloudiness: '雲量',
    forecast5Day: '5日間予報',
    forecastHourly: '時間別予報 (24時間)',
    recentSearches: '最近の検索',
    favorites: 'お気に入りの都市',
    addToFavorites: 'お気に入りに追加',
    removeFromFavorites: 'お気に入りから削除',
    clearHistory: '履歴をクリア',
    noSearches: '最近の検索はありません',
    noFavorites: 'お気に入りの都市はまだありません',
    profile: 'プロフィール',
  },
  KO: {
    title: '날씨',
    subtitle: '실시간 업데이트 및 예보',
    search: '도시 검색...',
    searchButton: '검색',
    loading: '날씨 데이터 불러오는 중...',
    feelsLike: '체감 온도',
    humidity: '습도',
    windSpeed: '풍속',
    windDirection: '풍향',
    pressure: '기압',
    cloudiness: '흐림',
    forecast5Day: '5일 예보',
    forecastHourly: '시간별 예보 (24시간)',
    recentSearches: '최근 검색',
    favorites: '즐겨찾는 도시',
    addToFavorites: '즐겨찾기 추가',
    removeFromFavorites: '즐겨찾기에서 제거',
    clearHistory: '기록 지우기',
    noSearches: '최근 검색 없음',
    noFavorites: '아직 즐겨찾는 도시가 없습니다',
    profile: '프로필',
  },
  ZH: {
    title: '天气',
    subtitle: '实时更新与天气预报',
    search: '搜索城市...',
    searchButton: '搜索',
    loading: '正在加载天气数据...',
    feelsLike: '体感温度',
    humidity: '湿度',
    windSpeed: '风速',
    windDirection: '风向',
    pressure: '气压',
    cloudiness: '云量',
    forecast5Day: '5天预报',
    forecastHourly: '每小时预报 (未来24小时)',
    recentSearches: '最近搜索',
    favorites: '收藏的城市',
    addToFavorites: '添加到收藏夹',
    removeFromFavorites: '从收藏夹中移除',
    clearHistory: '清除历史记录',
    noSearches: '没有最近搜索记录',
    noFavorites: '暂无收藏的城市',
    profile: '个人资料',
  },
};

// Hàm này dùng để cung cấp ngữ cảnh ứng dụng cho các component con (bao bọc ứng dụng)
export function AppProvider({ children }: { children: ReactNode }) {
  // Trạng thái lưu ngôn ngữ và đơn vị nhiệt độ mặc định
  const [language, setLanguage] = useState<Language>('EN');
  const [unit, setUnit] = useState<TempUnit>('C');
  // Trạng thái kiểm tra xem component đã render trên client chưa (để tránh lỗi hydration của Next.js)
  const [mounted, setMounted] = useState(false);

  // Chạy một lần khi component được gắn vào DOM (client-side) để lấy dữ liệu đã lưu từ trình duyệt
  useEffect(() => {
    // Lấy ngôn ngữ và đơn vị nhiệt độ từ localStorage, nếu không có thì dùng giá trị mặc định 'EN' và 'C'
    const savedLanguage = (localStorage.getItem('language') as Language) || 'EN';
    const savedUnit = (localStorage.getItem('tempUnit') as TempUnit) || 'C';
    setLanguage(savedLanguage);
    setUnit(savedUnit);
    setMounted(true); // Đánh dấu là đã mount thành công
  }, []);

  // Hàm chuyển đổi ngôn ngữ lần lượt qua danh sách hỗ trợ
  const toggleLanguage = () => {
    const languages: Language[] = ['EN', 'VI', 'JA', 'KO', 'ZH'];
    const currentIndex = languages.indexOf(language);
    // Tính toán index ngôn ngữ tiếp theo theo vòng tròn
    const newLang = languages[(currentIndex + 1) % languages.length];
    
    setLanguage(newLang);
    localStorage.setItem('language', newLang); // Lưu vào bộ nhớ trình duyệt
  };

  // Hàm chuyển đổi qua lại giữa độ C và độ F
  const toggleUnit = () => {
    const newUnit = unit === 'C' ? 'F' : 'C';
    setUnit(newUnit);
    localStorage.setItem('tempUnit', newUnit); // Lưu vào bộ nhớ trình duyệt
  };

  // Hàm tiện ích để dịch văn bản dựa theo khóa (key)
  const t = (key: string): string => {
    // Trả về bản dịch, nếu không tìm thấy thì trả về chính khóa (fallback)
    return translations[language][key as keyof typeof translations.EN] || key;
  };

  // Ngăn chặn hiện tượng nhấp nháy nội dung sai khi chuyển đổi ngôn ngữ (do SSR và Client lệch dữ liệu ban đầu)
  if (!mounted) {
    return null;
  }

  return (
    <AppContext.Provider value={{ language, toggleLanguage, unit, toggleUnit, t }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook tiện lợi dùng để lấy các giá trị từ AppContext tại bất kỳ nơi nào trong ứng dụng
export function useApp() {
  const context = useContext(AppContext);
  // Bắt lỗi nếu dùng hook này ở component không được bọc bởi AppProvider
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
