'use client';

import { ForecastData } from '@/types/weather';
import { getWeatherIcon, formatDate, formatTime } from '@/lib/utils';
import Image from 'next/image';
import { useApp } from '@/contexts/AppContext';

interface ForecastCardProps {
  forecast: ForecastData;
}

export default function ForecastCard({ forecast }: ForecastCardProps) {
  const dailyForecasts = forecast.list.filter((item, index) => index % 8 === 0).slice(0, 5);
  const { t } = useApp();

  return (
    <div className="backdrop-blur-2xl bg-white/10 rounded-3xl shadow-2xl p-8 md:p-10 max-w-7xl mx-auto mt-8 border border-white/20">
      <h3 className="text-4xl font-bold text-white mb-8 drop-shadow-lg">{t('forecast5Day')}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {dailyForecasts.map((item) => (
          <div
            key={item.dt}
            className="backdrop-blur-xl bg-white/10 p-6 rounded-2xl text-center border border-white/20
                       hover:bg-white/15 hover:scale-105 hover:shadow-2xl
                       transition-all duration-300 cursor-pointer group"
          >
            <p className="font-bold text-white mb-2 text-lg">
              {formatDate(item.dt)}
            </p>
            <p className="text-sm text-white/70 mb-4">
              {formatTime(item.dt)}
            </p>
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-white/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Image
                src={getWeatherIcon(item.weather[0].icon)}
                alt={item.weather[0].description}
                width={80}
                height={80}
                className="mx-auto relative z-10 drop-shadow-lg"
              />
            </div>
            <p className="text-4xl font-bold text-white my-3 drop-shadow-lg">
              {Math.round(item.main.temp)}°C
            </p>
            <p className="text-sm text-white/80 capitalize mb-4">
              {item.weather[0].description}
            </p>
            <div className="flex justify-center gap-4 text-sm text-white/70 font-medium">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.5 2a3.5 3.5 0 101.665 6.58L8.585 10l-1.42 1.42a3.5 3.5 0 101.414 1.414l8.128-8.127a1 1 0 00-1.414-1.414L10 8.586 8.58 7.165A3.5 3.5 0 005.5 2zM4 5.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" />
                </svg>
                {item.main.humidity}%
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                {item.wind.speed} m/s
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h4 className="text-2xl font-bold text-white mb-6 drop-shadow-lg">{t('forecastHourly')}</h4>
        <div className="overflow-x-auto custom-scrollbar">
          <div className="flex gap-4 pb-4">
            {forecast.list.slice(0, 8).map((item) => (
              <div
                key={item.dt}
                className="backdrop-blur-xl bg-white/10 p-5 rounded-2xl min-w-[150px] text-center border border-white/20
                           hover:bg-white/15 hover:scale-105 transition-all duration-200 cursor-pointer flex-shrink-0"
              >
                <p className="font-bold text-white text-base mb-3">
                  {formatTime(item.dt)}
                </p>
                <Image
                  src={getWeatherIcon(item.weather[0].icon)}
                  alt={item.weather[0].description}
                  width={64}
                  height={64}
                  className="mx-auto drop-shadow-lg"
                />
                <p className="text-3xl font-bold text-white my-3 drop-shadow-lg">
                  {Math.round(item.main.temp)}°C
                </p>
                <div className="flex justify-center items-center gap-1 text-sm text-white/70 font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.5 2a3.5 3.5 0 101.665 6.58L8.585 10l-1.42 1.42a3.5 3.5 0 101.414 1.414l8.128-8.127a1 1 0 00-1.414-1.414L10 8.586 8.58 7.165A3.5 3.5 0 005.5 2zM4 5.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" />
                  </svg>
                  {item.main.humidity}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
