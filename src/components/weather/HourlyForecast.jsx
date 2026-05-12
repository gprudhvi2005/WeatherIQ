import { motion } from 'framer-motion';
import { getWeatherEmoji } from '../../utils/weatherCodes';
import { formatTemp, formatHour } from '../../utils/formatters';
import useWeatherStore from '../../store/weatherStore';
import useThemeStore from '../../store/themeStore';

export default function HourlyForecast() {
  const weather = useWeatherStore((s) => s.weather);
  const unit = useThemeStore((s) => s.unit);
  if (!weather?.hourly) return null;

  const { time, temperature_2m, weather_code, precipitation_probability, is_day } = weather.hourly;
  const now = new Date();
  const currentHourIdx = time.findIndex(t => new Date(t) >= now);
  const startIdx = Math.max(0, currentHourIdx);
  const hours = time.slice(startIdx, startIdx + 24);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      className="glass-card p-6">
      <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Hourly Forecast</h3>
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
        {hours.map((t, i) => {
          const idx = startIdx + i;
          const isNow = i === 0;
          return (
            <motion.div key={t} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`flex flex-col items-center gap-2 min-w-[4.5rem] py-3 px-2 rounded-2xl transition-all ${
                isNow ? 'bg-white/20 ring-1 ring-white/30' : 'hover:bg-white/10'
              }`}>
              <span className="text-xs font-medium text-white/60">{isNow ? 'Now' : formatHour(t)}</span>
              <span className="text-2xl">{getWeatherEmoji(weather_code[idx], is_day?.[idx] === 0)}</span>
              <span className="text-sm font-semibold text-white">{formatTemp(temperature_2m[idx], unit)}</span>
              {precipitation_probability?.[idx] > 0 && (
                <span className="text-xs text-blue-300">{precipitation_probability[idx]}%</span>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
