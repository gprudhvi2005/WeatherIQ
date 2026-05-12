import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import useWeatherStore from '../../store/weatherStore';
import useThemeStore from '../../store/themeStore';
import { formatHour } from '../../utils/formatters';

export default function HourlyTempChart() {
  const weather = useWeatherStore((s) => s.weather);
  const unit = useThemeStore((s) => s.unit);
  if (!weather?.hourly) return null;

  const isFahr = unit === 'fahrenheit';
  const { time, temperature_2m } = weather.hourly;
  const now = new Date();
  const startIdx = time.findIndex(t => new Date(t) >= now);
  const data = time.slice(startIdx, startIdx + 24).map((t, i) => {
    const c = temperature_2m[startIdx + i];
    return {
      time: formatHour(t),
      temp: Math.round(isFahr ? c * 9 / 5 + 32 : c),
    };
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      className="glass-card p-6">
      <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Temperature Trend</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
              interval={3} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
              unit="°" domain={['dataMin - 2', 'dataMax + 2']} />
            <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 13 }}
              formatter={(val) => [`${val}°${isFahr ? 'F' : 'C'}`, 'Temp']} />
            <Area type="monotone" dataKey="temp" stroke="#818cf8" strokeWidth={2} fill="url(#tempGrad)"
              dot={false} activeDot={{ r: 4, fill: '#818cf8', stroke: '#fff', strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
