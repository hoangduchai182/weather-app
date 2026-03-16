'use client';

import { ForecastData } from '@/types/weather';
import { getWeatherIcon, formatDate, formatTemp } from '@/lib/utils';
import Image from 'next/image';
import { useApp } from '@/contexts/AppContext';

interface DailyForecastProps {
  forecast: ForecastData;
}

export default function DailyForecast({ forecast }: DailyForecastProps) {
  // Lấy dự báo hàng ngày từ dữ liệu dự báo mỗi 3 giờ (trả về index chia hết cho 8 = 1 mốc/ngày)
  const dailyForecasts = forecast.list.filter((item, index) => index % 8 === 0).slice(0, 5);
  // Import hàm đa ngôn ngữ (t) và đơn vị nhiệt (unit)
  const { t, unit } = useApp();

  return (
    <div className="backdrop-blur-2xl bg-white/10 rounded-3xl shadow-2xl p-6 md:p-8 h-full border border-white/20">
      <h3 className="text-2xl xl:text-3xl font-bold text-white mb-6 drop-shadow-lg">{t('forecast5Day')}</h3>
      <div className="flex flex-col gap-4">
        {/* Duyệt qua từng ngày và render UI */}
        {dailyForecasts.map((item) => (
          <div
            key={item.dt}
            className="backdrop-blur-xl bg-white/10 p-4 rounded-2xl flex items-center justify-between border border-white/20
                       hover:bg-white/15 hover:scale-[1.02] hover:shadow-xl
                       transition-all duration-300 cursor-pointer group"
          >
            {/* Box chứa thông tin ngày và trạng thái thời tiết chữ cái */}
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white text-base">{formatDate(item.dt)}</span>
              <span className="text-md text-white/70 capitalize">{item.weather[0].description}</span>
            </div>

            <div className="flex items-center gap-3">
              <Image
                src={getWeatherIcon(item.weather[0].icon)}
                alt={item.weather[0].description}
                width={50}
                height={50}
                className="drop-shadow-lg"
              />
              <span className="text-2xl font-bold text-white drop-shadow-lg w-16 text-right">
                {formatTemp(item.main.temp, unit)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
