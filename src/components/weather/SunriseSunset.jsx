import { motion } from 'framer-motion';
import useWeatherStore from '../../store/weatherStore';
import { formatTime, getSunPosition } from '../../utils/formatters';
import { WiSunrise, WiSunset } from 'react-icons/wi';

export default function SunriseSunset() {
  const weather = useWeatherStore((s) => s.weather);
  if (!weather?.daily) return null;

  const sunrise = weather.daily.sunrise?.[0];
  const sunset = weather.daily.sunset?.[0];
  const sunPos = getSunPosition(sunrise, sunset);

  // Arc path
  const arcWidth = 200;
  const arcHeight = 80;
  const sunX = (sunPos / 100) * arcWidth;
  const sunY = arcHeight - Math.sin((sunPos / 100) * Math.PI) * arcHeight;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
      className="glass-card p-6">
      <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Sunrise & Sunset</h3>
      {/* Sun arc */}
      <div className="relative mx-auto" style={{ width: arcWidth, height: arcHeight + 20 }}>
        <svg width={arcWidth} height={arcHeight + 20} viewBox={`0 0 ${arcWidth} ${arcHeight + 20}`} className="overflow-visible">
          {/* Dashed arc */}
          <path d={`M 0 ${arcHeight + 10} Q ${arcWidth / 2} ${-arcHeight + 10} ${arcWidth} ${arcHeight + 10}`}
            fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="4 4" />
          {/* Traveled path */}
          {sunPos > 0 && sunPos < 100 && (
            <path d={`M 0 ${arcHeight + 10} Q ${arcWidth / 2} ${-arcHeight + 10} ${arcWidth} ${arcHeight + 10}`}
              fill="none" stroke="rgba(250,204,21,0.4)" strokeWidth="2"
              strokeDasharray={`${sunPos * 3} 1000`} />
          )}
          {/* Sun dot */}
          {sunPos > 0 && sunPos < 100 && (
            <motion.circle cx={sunX} cy={sunY + 10} r="8" fill="#fbbf24"
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.5 }}>
              <animate attributeName="r" values="7;9;7" dur="3s" repeatCount="indefinite" />
            </motion.circle>
          )}
          {/* Horizon line */}
          <line x1="0" y1={arcHeight + 10} x2={arcWidth} y2={arcHeight + 10}
            stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        </svg>
      </div>
      <div className="flex justify-between mt-3">
        <div className="flex items-center gap-2">
          <WiSunrise className="w-6 h-6 text-yellow-400" />
          <div>
            <p className="text-xs text-white/50">Sunrise</p>
            <p className="text-sm font-semibold text-white">{formatTime(sunrise)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <WiSunset className="w-6 h-6 text-orange-400" />
          <div className="text-right">
            <p className="text-xs text-white/50">Sunset</p>
            <p className="text-sm font-semibold text-white">{formatTime(sunset)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
