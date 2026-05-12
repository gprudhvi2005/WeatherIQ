import { motion } from 'framer-motion';
import { getWeatherEmoji, getWeatherInfo } from '../../utils/weatherCodes';
import { formatTemp, formatDay } from '../../utils/formatters';
import useWeatherStore from '../../store/weatherStore';
import useThemeStore from '../../store/themeStore';

export default function DailyForecast() {
  const weather = useWeatherStore((s) => s.weather);
  const unit = useThemeStore((s) => s.unit);
  if (!weather?.daily) return null;

  const { time, weather_code, temperature_2m_max, temperature_2m_min, precipitation_probability_max } = weather.daily;
  
  // Find min and max across all days for the bar scale
  const allMin = Math.min(...temperature_2m_min.filter(v => v !== null));
  const allMax = Math.max(...temperature_2m_max.filter(v => v !== null));
  const range = allMax - allMin || 1;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      className="glass-card p-6">
      <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">7-Day Forecast</h3>
      <div className="space-y-1">
        {time.map((day, i) => {
          const minPos = ((temperature_2m_min[i] - allMin) / range) * 100;
          const maxPos = ((temperature_2m_max[i] - allMax) / range) * 100 + 100;
          const barLeft = minPos;
          const barWidth = ((temperature_2m_max[i] - temperature_2m_min[i]) / range) * 100;

          return (
            <motion.div key={day} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-white/5 transition-all">
              <span className="w-16 text-sm font-medium text-white/80">{formatDay(day)}</span>
              <span className="text-xl w-8 text-center">{getWeatherEmoji(weather_code[i])}</span>
              {precipitation_probability_max?.[i] > 0 && (
                <span className="w-10 text-xs text-blue-300 text-right">{precipitation_probability_max[i]}%</span>
              )}
              {(!precipitation_probability_max?.[i] || precipitation_probability_max[i] === 0) && (
                <span className="w-10" />
              )}
              <span className="w-10 text-sm text-white/50 text-right">{formatTemp(temperature_2m_min[i], unit)}</span>
              {/* Temperature bar */}
              <div className="flex-1 h-1.5 rounded-full bg-white/10 relative mx-2">
                <div className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 via-yellow-400 to-orange-400"
                  style={{ left: `${barLeft}%`, width: `${Math.max(barWidth, 5)}%` }} />
              </div>
              <span className="w-10 text-sm font-medium text-white">{formatTemp(temperature_2m_max[i], unit)}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
