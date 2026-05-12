import axios from 'axios';
import { API_URLS, WEATHER_PARAMS, AIR_QUALITY_PARAMS } from '../utils/constants';

const weatherClient = axios.create({
  timeout: 15000,
});

/**
 * Fetch complete weather data (current + hourly + daily) from Open-Meteo
 */
export async function fetchWeatherData(latitude, longitude) {
  const params = {
    latitude,
    longitude,
    current: WEATHER_PARAMS.current,
    hourly: WEATHER_PARAMS.hourly,
    daily: WEATHER_PARAMS.daily,
    timezone: 'auto',
    forecast_days: 7,
  };

  const response = await weatherClient.get(API_URLS.FORECAST, { params });
  return response.data;
}

/**
 * Fetch air quality data from Open-Meteo
 */
export async function fetchAirQuality(latitude, longitude) {
  const params = {
    latitude,
    longitude,
    current: AIR_QUALITY_PARAMS.current,
    hourly: AIR_QUALITY_PARAMS.hourly,
    timezone: 'auto',
    forecast_days: 3,
  };

  const response = await weatherClient.get(API_URLS.AIR_QUALITY, { params });
  return response.data;
}

/**
 * Fetch both weather and air quality data together
 */
export async function fetchAllWeatherData(latitude, longitude) {
  const [weather, airQuality] = await Promise.all([
    fetchWeatherData(latitude, longitude),
    fetchAirQuality(latitude, longitude).catch(() => null), // AQI is optional, don't fail if unavailable
  ]);

  return { weather, airQuality };
}

/**
 * Fetch weather data for a quick preview (used for saved city cards)
 */
export async function fetchWeatherPreview(latitude, longitude) {
  const params = {
    latitude,
    longitude,
    current: 'temperature_2m,weather_code,is_day,wind_speed_10m,relative_humidity_2m',
    daily: 'temperature_2m_max,temperature_2m_min',
    timezone: 'auto',
    forecast_days: 1,
  };

  const response = await weatherClient.get(API_URLS.FORECAST, { params });
  return response.data;
}
