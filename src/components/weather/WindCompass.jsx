import { motion } from 'framer-motion';
import useWeatherStore from '../../store/weatherStore';
import { formatWind, windDirectionToCompass } from '../../utils/formatters';

export default function WindCompass() {
  const weather = useWeatherStore((s) => s.weather);
  if (!weather?.current) return null;

  const { wind_speed_10m, wind_direction_10m, wind_gusts_10m } = weather.current;
  const compass = windDirectionToCompass(wind_direction_10m);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      className="glass-card p-6">
      <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Wind</h3>
      <div className="flex items-center gap-6">
        {/* Compass */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            {/* Cardinal directions */}
            {['N','E','S','W'].map((d, i) => {
              const angle = i * 90;
              const rad = (angle - 90) * Math.PI / 180;
              const x = 50 + Math.cos(rad) * 42;
              const y = 50 + Math.sin(rad) * 42;
              return <text key={d} x={x} y={y} textAnchor="middle" dominantBaseline="central"
                className="fill-white/40 text-[9px] font-medium">{d}</text>;
            })}
            {/* Arrow */}
            <motion.g initial={{ rotate: 0 }} animate={{ rotate: wind_direction_10m || 0 }}
              style={{ transformOrigin: '50px 50px' }} transition={{ type: 'spring', stiffness: 100 }}>
              <line x1="50" y1="20" x2="50" y2="50" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
              <polygon points="50,15 46,25 54,25" fill="#60a5fa" />
              <line x1="50" y1="50" x2="50" y2="70" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" />
            </motion.g>
            <circle cx="50" cy="50" r="3" fill="#60a5fa" />
          </svg>
        </div>
        <div className="flex-1 space-y-2">
          <div>
            <p className="text-2xl font-bold text-white">{formatWind(wind_speed_10m)}</p>
            <p className="text-sm text-white/50">{compass} direction</p>
          </div>
          {wind_gusts_10m && (
            <div className="pt-2 border-t border-white/10">
              <p className="text-xs text-white/40">Gusts</p>
              <p className="text-sm font-semibold text-white">{formatWind(wind_gusts_10m)}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
