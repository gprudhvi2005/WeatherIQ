// WMO Weather Code mappings to human-readable descriptions, icons, and backgrounds
// See: https://open-meteo.com/en/docs (Weather code documentation)

export const weatherCodeMap = {
  0:  { description: 'Clear sky', icon: 'clear', group: 'clear' },
  1:  { description: 'Mainly clear', icon: 'mainly-clear', group: 'clear' },
  2:  { description: 'Partly cloudy', icon: 'partly-cloudy', group: 'cloudy' },
  3:  { description: 'Overcast', icon: 'overcast', group: 'cloudy' },
  45: { description: 'Foggy', icon: 'fog', group: 'fog' },
  48: { description: 'Depositing rime fog', icon: 'fog', group: 'fog' },
  51: { description: 'Light drizzle', icon: 'drizzle', group: 'rain' },
  53: { description: 'Moderate drizzle', icon: 'drizzle', group: 'rain' },
  55: { description: 'Dense drizzle', icon: 'drizzle', group: 'rain' },
  56: { description: 'Light freezing drizzle', icon: 'freezing-drizzle', group: 'rain' },
  57: { description: 'Dense freezing drizzle', icon: 'freezing-drizzle', group: 'rain' },
  61: { description: 'Slight rain', icon: 'rain-light', group: 'rain' },
  63: { description: 'Moderate rain', icon: 'rain', group: 'rain' },
  65: { description: 'Heavy rain', icon: 'rain-heavy', group: 'rain' },
  66: { description: 'Light freezing rain', icon: 'freezing-rain', group: 'rain' },
  67: { description: 'Heavy freezing rain', icon: 'freezing-rain', group: 'rain' },
  71: { description: 'Slight snowfall', icon: 'snow-light', group: 'snow' },
  73: { description: 'Moderate snowfall', icon: 'snow', group: 'snow' },
  75: { description: 'Heavy snowfall', icon: 'snow-heavy', group: 'snow' },
  77: { description: 'Snow grains', icon: 'snow-grains', group: 'snow' },
  80: { description: 'Slight rain showers', icon: 'rain-shower', group: 'rain' },
  81: { description: 'Moderate rain showers', icon: 'rain-shower', group: 'rain' },
  82: { description: 'Violent rain showers', icon: 'rain-shower-heavy', group: 'rain' },
  85: { description: 'Slight snow showers', icon: 'snow-shower', group: 'snow' },
  86: { description: 'Heavy snow showers', icon: 'snow-shower', group: 'snow' },
  95: { description: 'Thunderstorm', icon: 'thunderstorm', group: 'thunderstorm' },
  96: { description: 'Thunderstorm with slight hail', icon: 'thunderstorm-hail', group: 'thunderstorm' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'thunderstorm-hail', group: 'thunderstorm' },
};

export function getWeatherInfo(code) {
  return weatherCodeMap[code] || { description: 'Unknown', icon: 'clear', group: 'clear' };
}

// Background gradient based on weather condition and time of day
export function getWeatherBackground(code, isNight = false) {
  const info = getWeatherInfo(code);
  
  if (isNight) {
    switch (info.group) {
      case 'clear':
        return 'from-[#0f172a] via-[#1e1b4b] to-[#312e81]';
      case 'cloudy':
        return 'from-[#1e293b] via-[#334155] to-[#475569]';
      case 'rain':
        return 'from-[#0f172a] via-[#1e293b] to-[#334155]';
      case 'snow':
        return 'from-[#1e293b] via-[#334155] to-[#475569]';
      case 'thunderstorm':
        return 'from-[#0f172a] via-[#1e1b4b] to-[#3730a3]';
      default:
        return 'from-[#0f172a] via-[#1e293b] to-[#334155]';
    }
  }
  
  switch (info.group) {
    case 'clear':
      return 'from-[#2563eb] via-[#3b82f6] to-[#60a5fa]';
    case 'cloudy':
      return 'from-[#475569] via-[#64748b] to-[#94a3b8]';
    case 'fog':
      return 'from-[#64748b] via-[#94a3b8] to-[#cbd5e1]';
    case 'rain':
      return 'from-[#1e293b] via-[#334155] to-[#475569]';
    case 'snow':
      return 'from-[#93c5fd] via-[#bfdbfe] to-[#e0e7ff]';
    case 'thunderstorm':
      return 'from-[#1e1b4b] via-[#3730a3] to-[#4f46e5]';
    default:
      return 'from-[#2563eb] via-[#3b82f6] to-[#60a5fa]';
  }
}

// Weather icon emoji/symbol for quick rendering
export function getWeatherEmoji(code, isNight = false) {
  const info = getWeatherInfo(code);
  
  if (isNight && info.group === 'clear') return '🌙';
  
  switch (info.group) {
    case 'clear': return '☀️';
    case 'cloudy': return code === 2 ? '⛅' : '☁️';
    case 'fog': return '🌫️';
    case 'rain': return code >= 80 ? '🌦️' : '🌧️';
    case 'snow': return '🌨️';
    case 'thunderstorm': return '⛈️';
    default: return '☀️';
  }
}
