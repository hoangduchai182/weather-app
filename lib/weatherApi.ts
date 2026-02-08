import { WeatherData, ForecastData } from "@/types/weather";

// Cấu hình API Key và URL cơ sở cho OpenWeatherMap
const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// Hàm lấy dữ liệu thời tiết hiện tại theo tên thành phố
export async function getCurrentWeather(city: string): Promise<WeatherData> {
  if (!API_KEY || API_KEY === 'your_openweathermap_api_key_here') {
    throw new Error("API key not configured. Please add your OpenWeatherMap API key to .env.local");
  }

  const response = await fetch(
    `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "City not found");
  }

  return response.json();
}

// Hàm lấy dữ liệu dự báo thời tiết theo tên thành phố
export async function getForecast(city: string): Promise<ForecastData> {
  if (!API_KEY || API_KEY === 'your_openweathermap_api_key_here') {
    throw new Error("API key not configured. Please add your OpenWeatherMap API key to .env.local");
  }

  const response = await fetch(
    `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Forecast not available");
  }

  return response.json();
}

// Hàm lấy dữ liệu thời tiết hiện tại theo tọa độ
export async function getCurrentWeatherByCoords(
  lat: number,
  lon: number
): Promise<WeatherData> {
  if (!API_KEY || API_KEY === 'your_openweathermap_api_key_here') {
    throw new Error("API key not configured. Please add your OpenWeatherMap API key to .env.local");
  }

  const response = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Weather data not available");
  }

  return response.json();
}

// Hàm lấy dữ liệu dự báo thời tiết theo tọa độ
export async function getForecastByCoords(
  lat: number,
  lon: number
): Promise<ForecastData> {
  if (!API_KEY || API_KEY === 'your_openweathermap_api_key_here') {
    throw new Error("API key not configured. Please add your OpenWeatherMap API key to .env.local");
  }

  const response = await fetch(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Forecast not available");
  }

  return response.json();
}
