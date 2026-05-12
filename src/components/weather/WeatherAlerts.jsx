import { motion } from 'framer-motion';
import useWeatherStore from '../../store/weatherStore';
import { FiAlertTriangle } from 'react-icons/fi';

export default function WeatherAlerts() {
  const weather = useWeatherStore((s) => s.weather);
  if (!weather?.daily) return null;

  // Generate alerts based on conditions
  const alerts = [];
  const daily = weather.daily;
  const current = weather.current;

  // High temperature alert
  if (daily.temperature_2m_max?.[0] > 38) {
    alerts.push({ type: 'heat', message: `Extreme heat warning: ${Math.round(daily.temperature_2m_max[0])}°C expected today`, severity: 'high' });
  } else if (daily.temperature_2m_max?.[0] > 35) {
    alerts.push({ type: 'heat', message: `Heat advisory: ${Math.round(daily.temperature_2m_max[0])}°C expected today`, severity: 'medium' });
  }

  // Heavy rain alert
  if (daily.precipitation_probability_max?.[0] > 80) {
    alerts.push({ type: 'rain', message: `High chance of rain today (${daily.precipitation_probability_max[0]}%)`, severity: 'medium' });
  }

  // Strong wind alert
  if (daily.wind_gusts_10m_max?.[0] > 60) {
    alerts.push({ type: 'wind', message: `Strong wind gusts up to ${Math.round(daily.wind_gusts_10m_max[0])} km/h`, severity: 'medium' });
  }

  // UV alert
  if (daily.uv_index_max?.[0] > 8) {
    alerts.push({ type: 'uv', message: `Very high UV index (${daily.uv_index_max[0]}). Limit sun exposure.`, severity: 'high' });
  }

  if (alerts.length === 0) return null;

  const severityColors = {
    high: 'bg-red-500/20 border-red-500/30 text-red-300',
    medium: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300',
    low: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
      {alerts.map((alert, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`flex items-center gap-3 p-4 rounded-xl border ${severityColors[alert.severity]}`}>
          <FiAlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{alert.message}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
