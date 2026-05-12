import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import useWeatherStore from '../../store/weatherStore';
import useThemeStore from '../../store/themeStore';
import { formatDay } from '../../utils/formatters';

export default function WeeklyChart() {
  const weather = useWeatherStore((s) => s.weather);
  const unit = useThemeStore((s) => s.unit);
  if (!weather?.daily) return null;

  const isFahr = unit === 'fahrenheit';
  const toUnit = (c) => Math.round(isFahr ? c * 9 / 5 + 32 : c);
  const { time, temperature_2m_max, temperature_2m_min } = weather.daily;
  const data = time.map((t, i) => ({
    day: formatDay(t),
    max: toUnit(temperature_2m_max[i]),
    min: toUnit(temperature_2m_min[i]),
  }));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
      className="glass-card p-6">
      <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Weekly Temperature</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barGap={2}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
              unit="°" domain={['dataMin - 3', 'dataMax + 3']} />
            <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 13 }}
              formatter={(val, name) => [`${val}°${isFahr ? 'F' : 'C'}`, name === 'max' ? 'High' : 'Low']} />
            <Bar dataKey="min" radius={[4, 4, 0, 0]} fill="#60a5fa" opacity={0.5} />
            <Bar dataKey="max" radius={[4, 4, 0, 0]} fill="#f97316" opacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
