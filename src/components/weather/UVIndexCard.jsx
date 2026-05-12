import { motion } from 'framer-motion';
import useWeatherStore from '../../store/weatherStore';
import { formatUVIndex } from '../../utils/formatters';

export default function UVIndexCard() {
  const weather = useWeatherStore((s) => s.weather);
  const daily = weather?.daily;
  if (!daily) return null;

  const uvMax = daily.uv_index_max?.[0];
  const { value, level, color } = formatUVIndex(uvMax);
  const percentage = Math.min((uvMax / 11) * 100, 100);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
      className="glass-card p-6">
      <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">UV Index</h3>
      <div className="flex items-end gap-3 mb-4">
        <span className={`text-4xl font-bold ${color}`}>{value}</span>
        <span className={`text-lg font-medium ${color} mb-1`}>{level}</span>
      </div>
      {/* UV Scale bar */}
      <div className="relative h-2 rounded-full overflow-hidden bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-purple-500">
        <motion.div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg border-2 border-white"
          style={{ left: `${percentage}%` }}
          initial={{ left: '0%' }}
          animate={{ left: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }} />
      </div>
      <div className="flex justify-between mt-2 text-[10px] text-white/40">
        <span>Low</span><span>Moderate</span><span>High</span><span>Extreme</span>
      </div>
    </motion.div>
  );
}
