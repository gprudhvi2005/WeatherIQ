import { motion } from 'framer-motion';
import { getWeatherEmoji, getWeatherInfo } from '../../utils/weatherCodes';
import { formatTemp } from '../../utils/formatters';
import useThemeStore from '../../store/themeStore';
import { FiX, FiMapPin } from 'react-icons/fi';

export default function CityCard({ city, weather, onSelect, onRemove, index = 0 }) {
  const unit = useThemeStore((s) => s.unit);
  const weatherCode = weather?.current?.weather_code ?? 0;
  const isNight = weather?.current?.is_day === 0;
  const info = getWeatherInfo(weatherCode);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="glass-card p-5 cursor-pointer group relative overflow-hidden"
      onClick={() => onSelect?.(city)}
    >
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <FiMapPin className="w-3.5 h-3.5 text-primary-400" />
            <h3 className="font-semibold text-surface-900 dark:text-white truncate">{city.city_name}</h3>
          </div>
          <p className="text-sm text-surface-500 dark:text-surface-400 truncate">{city.country || ''}</p>
          {weather && (
            <div className="mt-3 flex items-center gap-3">
              <span className="text-2xl font-bold text-surface-900 dark:text-white">{formatTemp(weather.current?.temperature_2m, unit)}</span>
              <span className="text-sm text-surface-500 dark:text-surface-400">{info.description}</span>
            </div>
          )}
        </div>
        <span className="text-4xl">{getWeatherEmoji(weatherCode, isNight)}</span>
      </div>
      {onRemove && (
        <button onClick={(e) => { e.stopPropagation(); onRemove(city.id); }}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-surface-200/50 dark:bg-surface-700/50 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-500 transition-all"
          aria-label="Remove city"><FiX className="w-3.5 h-3.5" /></button>
      )}
    </motion.div>
  );
}
