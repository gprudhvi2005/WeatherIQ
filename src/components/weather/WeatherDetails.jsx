import { motion } from 'framer-motion';
import { WiHumidity, WiBarometer, WiStrongWind, WiDust } from 'react-icons/wi';
import { FiEye, FiDroplet } from 'react-icons/fi';
import { formatWind, formatPressure, formatVisibility, formatHumidity, windDirectionToCompass } from '../../utils/formatters';
import useWeatherStore from '../../store/weatherStore';

const detailItems = (current, hourly) => {
  const currentHourIdx = hourly?.time?.findIndex(t => new Date(t) >= new Date()) ?? 0;
  return [
    { label: 'Humidity', value: formatHumidity(current?.relative_humidity_2m), icon: WiHumidity, color: 'text-blue-400' },
    { label: 'Wind', value: `${formatWind(current?.wind_speed_10m)} ${windDirectionToCompass(current?.wind_direction_10m)}`, icon: WiStrongWind, color: 'text-cyan-400' },
    { label: 'Pressure', value: formatPressure(current?.pressure_msl), icon: WiBarometer, color: 'text-purple-400' },
    { label: 'Visibility', value: formatVisibility(hourly?.visibility?.[Math.max(0, currentHourIdx)]), icon: FiEye, color: 'text-green-400' },
    { label: 'Cloud Cover', value: current?.cloud_cover != null ? `${current.cloud_cover}%` : '--', icon: WiDust, color: 'text-gray-400' },
    { label: 'Precipitation', value: current?.precipitation != null ? `${current.precipitation} mm` : '--', icon: FiDroplet, color: 'text-indigo-400' },
  ];
};

export default function WeatherDetails() {
  const weather = useWeatherStore((s) => s.weather);
  if (!weather?.current) return null;

  const items = detailItems(weather.current, weather.hourly);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      className="glass-card p-6">
      <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Weather Details</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className="flex flex-col items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
            <item.icon className={`w-7 h-7 ${item.color} mb-2`} />
            <span className="text-lg font-bold text-white">{item.value}</span>
            <span className="text-xs text-white/50 mt-1">{item.label}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
