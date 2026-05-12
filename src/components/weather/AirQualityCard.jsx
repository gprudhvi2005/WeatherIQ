import { motion } from 'framer-motion';
import useWeatherStore from '../../store/weatherStore';
import { getAQILevel } from '../../utils/formatters';

export default function AirQualityCard() {
  const airQuality = useWeatherStore((s) => s.airQuality);
  if (!airQuality?.current) return null;

  const aqi = airQuality.current.us_aqi;
  const { level, color, textColor } = getAQILevel(aqi);
  const pm25 = airQuality.current.pm2_5;
  const pm10 = airQuality.current.pm10;
  const percentage = Math.min((aqi / 300) * 100, 100);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
      className="glass-card p-6">
      <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Air Quality</h3>
      <div className="flex items-center gap-6">
        {/* AQI Gauge */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
            <motion.circle cx="50" cy="50" r="42" fill="none" strokeWidth="8" strokeLinecap="round"
              stroke={getAQILevel(aqi).color.replace('bg-', '').includes('green') ? '#22c55e' :
                getAQILevel(aqi).color.includes('yellow') ? '#eab308' :
                getAQILevel(aqi).color.includes('orange') ? '#f97316' :
                getAQILevel(aqi).color.includes('red') ? '#ef4444' :
                getAQILevel(aqi).color.includes('purple') ? '#a855f7' : '#881337'}
              strokeDasharray={`${percentage * 2.64} ${264 - percentage * 2.64}`}
              initial={{ strokeDasharray: '0 264' }}
              animate={{ strokeDasharray: `${percentage * 2.64} ${264 - percentage * 2.64}` }}
              transition={{ duration: 1.5, ease: 'easeOut' }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">{Math.round(aqi)}</span>
            <span className="text-[10px] text-white/50">AQI</span>
          </div>
        </div>
        <div className="flex-1">
          <p className={`text-lg font-semibold ${textColor}`}>{level}</p>
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-white/50">PM2.5</span>
              <span className="text-white font-medium">{pm25?.toFixed(1) ?? '--'} μg/m³</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/50">PM10</span>
              <span className="text-white font-medium">{pm10?.toFixed(1) ?? '--'} μg/m³</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
