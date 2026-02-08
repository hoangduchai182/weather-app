// Hàm lấy icon thời tiết từ OpenWeatherMap dựa trên mã icon
export function getWeatherIcon(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

// Hàm lấy hướng gió từ góc độ
export function getWindDirection(deg: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
}

// Hàm định dạng ngày giờ từ timestamp
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
