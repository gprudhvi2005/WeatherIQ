import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import WeatherIcon from '../common/WeatherIcon';
import { getWeatherInfo } from '../../utils/weatherCodes';
import { formatTemp, formatFullDate } from '../../utils/formatters';
import useWeatherStore from '../../store/weatherStore';
import useThemeStore from '../../store/themeStore';
import useCitiesStore from '../../store/citiesStore';
import useAuthStore from '../../store/authStore';
import { isSupabaseConfigured } from '../../lib/supabaseClient';
import toast from 'react-hot-toast';
import { FiBookmark, FiMapPin, FiRefreshCw } from 'react-icons/fi';

export default function CurrentWeather() {
  const { weather, location, loading, refresh } = useWeatherStore();
  const unit = useThemeStore((s) => s.unit);
  const { addCity, fetchCities, isCitySaved, cities } = useCitiesStore();
  const user = useAuthStore((s) => s.user);
  const [saving, setSaving] = useState(false);
  const current = weather?.current;
  const daily = weather?.daily;

  if (!current) return null;

  const weatherCode = current.weather_code;
  const isNight = current.is_day === 0;
  const info = getWeatherInfo(weatherCode);
  const todayMax = daily?.temperature_2m_max?.[0];
  const todayMin = daily?.temperature_2m_min?.[0];
  const canSave = isSupabaseConfigured && !!user;
  const alreadySaved = useMemo(() => {
    if (!location?.name) return false;
    return isCitySaved(location.name);
  }, [location?.name, isCitySaved, cities.length]);

  useEffect(() => {
    if (canSave) fetchCities();
  }, [canSave, fetchCities]);

  const handleSaveCity = async () => {
    if (!canSave) return;
    if (!location?.name || !location?.latitude || !location?.longitude) {
      toast.error('Select a city first');
      return;
    }
    if (alreadySaved) {
      toast('City already saved');
      return;
    }
    setSaving(true);
    try {
      await addCity({
        cityName: location.name,
        latitude: location.latitude,
        longitude: location.longitude,
        country: location.country,
      });
      toast.success('City saved');
    } catch (err) {
      toast.error(err?.message || 'Failed to save city');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card-strong p-8 relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-white/70 mb-1">
              <FiMapPin className="w-4 h-4" />
              <span className="text-sm font-medium">
                {location.name}{location.country ? `, ${location.country}` : ''}
              </span>
            </div>
            <p className="text-white/50 text-sm">{formatFullDate(daily?.time?.[0])}</p>
          </div>
          <div className="flex items-center gap-2">
            {canSave && (
              <button
                onClick={handleSaveCity}
                disabled={saving || alreadySaved}
                className={`p-2 rounded-xl transition-all ${
                  alreadySaved
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'
                }`}
                title={alreadySaved ? 'City saved' : 'Save city'}
                aria-label={alreadySaved ? 'City saved' : 'Save city'}
              >
                <FiBookmark className="w-5 h-5" />
              </button>
            )}
            <button onClick={refresh} disabled={loading}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all">
              <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <motion.div className="text-8xl font-extralight text-white tracking-tighter"
              initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
              {formatTemp(current.temperature_2m, unit)}
            </motion.div>
            <p className="text-xl text-white/80 mt-2 font-medium">{info.description}</p>
            <div className="flex items-center gap-4 mt-2 text-white/60 text-sm">
              <span>Feels like {formatTemp(current.apparent_temperature, unit)}</span>
              <span>H: {formatTemp(todayMax, unit)}</span>
              <span>L: {formatTemp(todayMin, unit)}</span>
            </div>
          </div>
          <WeatherIcon code={weatherCode} isNight={isNight} size="text-8xl" />
        </div>
      </div>
    </motion.div>
  );
}
