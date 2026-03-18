'use client';

import { useRef, useState } from 'react';
import { ForecastData } from '@/types/weather';
import { getWeatherIcon, formatTime, formatTemp } from '@/lib/utils';
import Image from 'next/image';
import { useApp } from '@/contexts/AppContext';

interface HourlyForecastProps {
  forecast: ForecastData;
}

export default function HourlyForecast({ forecast }: HourlyForecastProps) {
  // Lấy đơn vị nhiệt (unit) và hàm dịch (t) từ context
  const { t, unit } = useApp();
  
  // Ref dùng để tham chiếu tới container thẻ div cuộn (dành cho tính năng drag-to-scroll)
  const scrollRef = useRef<HTMLDivElement>(null);
  // Trạng thái kiểm tra xem người dùng có đang giữ chuột không
  const [isDragging, setIsDragging] = useState(false);
  // Vị trí chuột theo chiều X lúc bắt đầu nhấn
  const [startX, setStartX] = useState(0);
  // Vị trí cuộn thanh scroll theo chiều X lúc bắt đầu nhấn 
  const [scrollLeft, setScrollLeft] = useState(0);

  // Xử lý khi nhấn chuột xuống: bật trạng thái kéo và lưu tọa độ X hiện hành
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    if (!scrollRef.current) return;
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
  };

  // Xử lý khi thả chuột: tắt trạng thái kéo
  const onMouseUp = () => {
    setIsDragging(false);
  };

  // Xử lý khi người dùng di chuột: nếu không giữ chuột (isDragging = false) thì không làm gì
  // Nếu có giữ chuột thì tính toán bước độ dời để scroll tương ứng
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Tốc độ trượt (bước nhân 2 cho lướt nhanh hơn)
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="backdrop-blur-2xl bg-white/10 rounded-3xl shadow-2xl p-6 md:p-8 h-full border border-white/20 flex flex-col pt-8">
      <h4 className="text-2xl xl:text-3xl font-bold text-white mb-6 drop-shadow-lg">{t('forecastHourly')}</h4>
      
      <div 
        className={`overflow-x-auto custom-scrollbar flex-1 flex flex-col ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        <div className="flex gap-4 pb-4 w-full">
          {/* Dự báo hàng giờ (24 giờ tới) */}
          {forecast.list.slice(0, 8).map((item) => (
            <div
              key={item.dt}
              className="backdrop-blur-xl bg-white/10 p-5 rounded-2xl min-w-[140px] flex-1 text-center border border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-200 flex-shrink-0 select-none group"
            >
              <div>
                <p className="font-bold text-white text-base mb-3">
                  {formatTime(item.dt)}
                </p>
              </div>
              
              <div className="relative w-16 h-16 mx-auto">
                <Image
                  src={getWeatherIcon(item.weather[0].icon)}
                  alt={item.weather[0].description}
                  fill
                  className="object-contain drop-shadow-lg pointer-events-none"
                  draggable={false}
                />
              </div>
              
              <p className="text-3xl font-bold text-white my-3 drop-shadow-lg">
                {formatTemp(item.main.temp, unit)}
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
  );
}
