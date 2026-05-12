import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import useWeatherStore from '../../store/weatherStore';
import { formatHour } from '../../utils/formatters';

export default function PrecipChart() {
  const weather = useWeatherStore((s) => s.weather);
  if (!weather?.hourly) return null;

  const { time, precipitation_probability } = weather.hourly;
  if (!precipitation_probability) return null;

  const now = new Date();
  const startIdx = time.findIndex(t => new Date(t) >= now);
  const data = time.slice(startIdx, startIdx + 24).map((t, i) => ({
    time: formatHour(t),
    prob: precipitation_probability[startIdx + i] ?? 0,
  }));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      className="glass-card p-6">
      <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Rain Probability</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="precipGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" axisLine={false} tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} interval={3} />
            <YAxis axisLine={false} tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
              unit="%" domain={[0, 100]} />
            <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 13 }}
              formatter={(val) => [`${val}%`, 'Rain Chance']} />
            <Area type="stepAfter" dataKey="prob" stroke="#3b82f6" strokeWidth={2}
              fill="url(#precipGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
