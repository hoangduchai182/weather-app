// Hàm lấy icon thời tiết từ OpenWeatherMap dựa trên mã icon
export function getWeatherIcon(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

// Hàm lấy hướng gió từ góc độ (0 đến 360 độ)
export function getWindDirection(deg: number): string {
  // Mảng 8 hướng chính của la bàn
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  // Chia 360 độ cho 45 để lấy index (mỗi hướng chiếm 45 độ), chia lấy phần dư do vòng tròn (để 360 độ quay lại N=0)
  const index = Math.round(deg / 45) % 8;
  return directions[index];
}

// Hàm định dạng ngày giờ từ timestamp (dịch sang Date form ngắn gọn chuẩn Anh-Mỹ)
export function formatDateTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Hàm định dạng chỉ giờ từ timestamp
export function formatTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Hàm định dạng chỉ ngày từ timestamp
export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

// Hàm định dạng nhiệt độ theo đơn vị C hoặc F
export function formatTemp(tempCelsius: number, unit: 'C' | 'F'): string {
  if (unit === 'F') {
    // Công thức chuyển từ C sang F: (C * 9/5) + 32, và dùng Math.round để làm tròn số nguyên gần nhất
    return `${Math.round(tempCelsius * 9 / 5 + 32)}°F`;
  }
  // Nếu là C thì chỉ cần làm tròn số liệu nhiệt độ gốc
  return `${Math.round(tempCelsius)}°C`;
}

// Hàm định dạng tốc độ gió theo đơn vị nhiệt độ
// Khi đơn vị là C: giữ nguyên m/s (đơn vị gốc từ API)
// Khi đơn vị là F: chuyển sang km/h (m/s × 3.6)
export function formatWindSpeed(speedMs: number, unit: 'C' | 'F'): string {
  if (unit === 'F') {
    return `${Math.round(speedMs * 3.6)} km/h`;
  }
  return `${Math.round(speedMs * 10) / 10} m/s`;
}
