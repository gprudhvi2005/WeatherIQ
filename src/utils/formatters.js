import { format, parseISO, isToday, isTomorrow, addHours } from 'date-fns';

/**
 * Format temperature value with unit
 * @param {number} temp - Temperature in Celsius (from Open-Meteo)
 * @param {string} unit - 'celsius' or 'fahrenheit'
 */
export function formatTemp(temp, unit = 'celsius') {
  if (temp === null || temp === undefined) return '--';
  if (unit === 'fahrenheit') {
    return `${Math.round(temp * 9 / 5 + 32)}°F`;
  }
  return `${Math.round(temp)}°C`;
}


/**
 * Format wind speed with unit
 */
export function formatWind(speed, unit = 'km/h') {
  if (speed === null || speed === undefined) return '--';
  return `${Math.round(speed)} ${unit}`;
}

/**
 * Convert wind direction degrees to compass direction
 */
export function windDirectionToCompass(degrees) {
  if (degrees === null || degrees === undefined) return '--';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

/**
 * Format pressure with unit
 */
export function formatPressure(pressure, unit = 'hPa') {
  if (pressure === null || pressure === undefined) return '--';
  return `${Math.round(pressure)} ${unit}`;
}

/**
 * Format visibility
 */
export function formatVisibility(meters) {
  if (meters === null || meters === undefined) return '--';
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
}

/**
 * Format humidity percentage
 */
export function formatHumidity(humidity) {
  if (humidity === null || humidity === undefined) return '--';
  return `${Math.round(humidity)}%`;
}

/**
 * Format UV index with level description
 */
export function formatUVIndex(uv) {
  if (uv === null || uv === undefined) return { value: '--', level: 'Unknown', color: 'text-surface-400' };
  const val = Math.round(uv * 10) / 10;
  
  if (val <= 2) return { value: val, level: 'Low', color: 'text-green-500' };
  if (val <= 5) return { value: val, level: 'Moderate', color: 'text-yellow-500' };
  if (val <= 7) return { value: val, level: 'High', color: 'text-orange-500' };
  if (val <= 10) return { value: val, level: 'Very High', color: 'text-red-500' };
  return { value: val, level: 'Extreme', color: 'text-purple-500' };
}

/**
 * Get AQI level info
 */
export function getAQILevel(aqi) {
  if (aqi === null || aqi === undefined) return { level: 'Unknown', color: 'bg-surface-400', textColor: 'text-surface-400' };
  
  if (aqi <= 50) return { level: 'Good', color: 'bg-green-500', textColor: 'text-green-500' };
  if (aqi <= 100) return { level: 'Moderate', color: 'bg-yellow-500', textColor: 'text-yellow-500' };
  if (aqi <= 150) return { level: 'Unhealthy for Sensitive', color: 'bg-orange-500', textColor: 'text-orange-500' };
  if (aqi <= 200) return { level: 'Unhealthy', color: 'bg-red-500', textColor: 'text-red-500' };
  if (aqi <= 300) return { level: 'Very Unhealthy', color: 'bg-purple-500', textColor: 'text-purple-500' };
  return { level: 'Hazardous', color: 'bg-rose-900', textColor: 'text-rose-900' };
}

/**
 * Format time from ISO string (e.g., "14:00" or "2:00 PM")
 */
export function formatTime(isoString) {
  if (!isoString) return '--';
  try {
    return format(parseISO(isoString), 'h:mm a');
  } catch {
    return '--';
  }
}

/**
 * Format hour from ISO string (e.g., "2 PM")
 */
export function formatHour(isoString) {
  if (!isoString) return '--';
  try {
    return format(parseISO(isoString), 'h a');
  } catch {
    return '--';
  }
}

/**
 * Format date for daily forecast
 */
export function formatDay(isoString) {
  if (!isoString) return '--';
  try {
    const date = parseISO(isoString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEE');
  } catch {
    return '--';
  }
}

/**
 * Format full date
 */
export function formatFullDate(isoString) {
  if (!isoString) return '--';
  try {
    return format(parseISO(isoString), 'EEEE, MMMM d');
  } catch {
    return '--';
  }
}

/**
 * Check if current time is nighttime based on sunrise/sunset
 */
export function isNightTime(sunrise, sunset) {
  if (!sunrise || !sunset) {
    const hour = new Date().getHours();
    return hour < 6 || hour >= 18;
  }
  
  try {
    const now = new Date();
    const sunriseDate = parseISO(sunrise);
    const sunsetDate = parseISO(sunset);
    return now < sunriseDate || now > sunsetDate;
  } catch {
    const hour = new Date().getHours();
    return hour < 6 || hour >= 18;
  }
}

/**
 * Calculate sun position percentage (0 = sunrise, 100 = sunset)
 */
export function getSunPosition(sunrise, sunset) {
  if (!sunrise || !sunset) return 50;
  
  try {
    const now = new Date().getTime();
    const sunriseTime = parseISO(sunrise).getTime();
    const sunsetTime = parseISO(sunset).getTime();
    
    if (now <= sunriseTime) return 0;
    if (now >= sunsetTime) return 100;
    
    return ((now - sunriseTime) / (sunsetTime - sunriseTime)) * 100;
  } catch {
    return 50;
  }
}
