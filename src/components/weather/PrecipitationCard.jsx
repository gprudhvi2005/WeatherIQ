import { motion } from 'framer-motion';
import useWeatherStore from '../../store/weatherStore';
import { FiDroplet } from 'react-icons/fi';

export default function PrecipitationCard() {
  const weather = useWeatherStore((s) => s.weather);
  if (!weather?.daily) return null;

  const precipProb = weather.daily.precipitation_probability_max?.[0] ?? 0;
  const precipSum = weather.daily.precipitation_sum?.[0] ?? 0;
  const rainSum = weather.daily.rain_sum?.[0] ?? 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
      className="glass-card p-6">
      <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Precipitation</h3>
      <div className="flex items-center gap-4">
        <div className="relative">
          <FiDroplet className="w-12 h-12 text-blue-400" />
          <motion.div className="absolute bottom-0 left-0 right-0 bg-blue-400/30 rounded-b-full overflow-hidden"
            style={{ height: `${precipProb}%` }}
            initial={{ height: 0 }}
            animate={{ height: `${precipProb}%` }}
            transition={{ duration: 1, ease: 'easeOut' }} />
        </div>
        <div className="flex-1">
          <p className="text-3xl font-bold text-white">{precipProb}%</p>
          <p className="text-sm text-white/50">chance of rain</p>
          <div className="flex gap-4 mt-2 text-xs text-white/40">
            <span>Total: {precipSum.toFixed(1)} mm</span>
            <span>Rain: {rainSum.toFixed(1)} mm</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
