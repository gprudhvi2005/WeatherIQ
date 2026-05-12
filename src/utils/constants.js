// AQI breakpoints (US EPA standard)
export const AQI_LEVELS = [
  { min: 0, max: 50, level: 'Good', color: '#22c55e', advice: 'Air quality is satisfactory.' },
  { min: 51, max: 100, level: 'Moderate', color: '#eab308', advice: 'Acceptable for most people.' },
  { min: 101, max: 150, level: 'Unhealthy for Sensitive Groups', color: '#f97316', advice: 'Sensitive groups should limit outdoor activity.' },
  { min: 151, max: 200, level: 'Unhealthy', color: '#ef4444', advice: 'Everyone may begin to experience health effects.' },
  { min: 201, max: 300, level: 'Very Unhealthy', color: '#a855f7', advice: 'Health alert: everyone may experience serious effects.' },
  { min: 301, max: 500, level: 'Hazardous', color: '#881337', advice: 'Emergency conditions. Stay indoors.' },
];

// UV Index scale
export const UV_LEVELS = [
  { min: 0, max: 2, level: 'Low', color: '#22c55e', advice: 'No protection needed.' },
  { min: 3, max: 5, level: 'Moderate', color: '#eab308', advice: 'Wear sunscreen.' },
  { min: 6, max: 7, level: 'High', color: '#f97316', advice: 'Reduce sun exposure.' },
  { min: 8, max: 10, level: 'Very High', color: '#ef4444', advice: 'Extra protection needed.' },
  { min: 11, max: 20, level: 'Extreme', color: '#a855f7', advice: 'Avoid sun exposure.' },
];

// Open-Meteo API base URLs
export const API_URLS = {
  FORECAST: 'https://api.open-meteo.com/v1/forecast',
  AIR_QUALITY: 'https://air-quality-api.open-meteo.com/v1/air-quality',
  GEOCODING: 'https://geocoding-api.open-meteo.com/v1/search',
};

// Default weather params for Open-Meteo
export const WEATHER_PARAMS = {
  current: [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'is_day',
    'precipitation',
    'rain',
    'weather_code',
    'cloud_cover',
    'pressure_msl',
    'surface_pressure',
    'wind_speed_10m',
    'wind_direction_10m',
    'wind_gusts_10m',
  ].join(','),
  hourly: [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'precipitation_probability',
    'precipitation',
    'weather_code',
    'visibility',
    'wind_speed_10m',
    'wind_direction_10m',
    'uv_index',
    'is_day',
  ].join(','),
  daily: [
    'weather_code',
    'temperature_2m_max',
    'temperature_2m_min',
    'apparent_temperature_max',
    'apparent_temperature_min',
    'sunrise',
    'sunset',
    'uv_index_max',
    'precipitation_sum',
    'rain_sum',
    'precipitation_hours',
    'precipitation_probability_max',
    'wind_speed_10m_max',
    'wind_gusts_10m_max',
    'wind_direction_10m_dominant',
  ].join(','),
};

export const AIR_QUALITY_PARAMS = {
  current: 'us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone',
  hourly: 'us_aqi,pm2_5,pm10,uv_index,uv_index_clear_sky',
};

// App constants
export const APP_NAME = 'WeatherIQ';
export const MAX_SAVED_CITIES = 10;
export const SEARCH_DEBOUNCE_MS = 300;
export const GEOCODING_RESULTS_COUNT = 8;
