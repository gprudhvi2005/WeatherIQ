import { useEffect } from 'react';
import { motion } from 'framer-motion';
import useWeatherStore from '../store/weatherStore';
import CurrentWeather from '../components/weather/CurrentWeather';
import HourlyForecast from '../components/weather/HourlyForecast';
import DailyForecast from '../components/weather/DailyForecast';
import WeatherDetails from '../components/weather/WeatherDetails';
import AirQualityCard from '../components/weather/AirQualityCard';
import SunriseSunset from '../components/weather/SunriseSunset';
import WindCompass from '../components/weather/WindCompass';
import UVIndexCard from '../components/weather/UVIndexCard';
import PrecipitationCard from '../components/weather/PrecipitationCard';
import WeatherAlerts from '../components/weather/WeatherAlerts';
import HourlyTempChart from '../components/charts/HourlyTempChart';
import WeeklyChart from '../components/charts/WeeklyChart';
import PrecipChart from '../components/charts/PrecipChart';
import { DashboardSkeleton } from '../components/common/SkeletonLoader';

export default function DashboardPage() {
  const { weather, loading, error, detectLocation, location } = useWeatherStore();

  useEffect(() => {
    if (!weather && !loading) {
      detectLocation();
    }
  }, []);

  if (loading && !weather) return <DashboardSkeleton />;

  if (error && !weather) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <span className="text-6xl mb-4">🌥️</span>
        <h2 className="text-2xl font-bold text-white mb-2">Unable to load weather</h2>
        <p className="text-white/50 mb-6 max-w-md">{error}</p>
        <button onClick={detectLocation} className="btn-primary">Try Again</button>
      </motion.div>
    );
  }

  if (!weather) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="space-y-6">
      {/* Weather Alerts */}
      <WeatherAlerts />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Weather - spans 2 cols */}
        <div className="lg:col-span-2">
          <CurrentWeather />
        </div>

        {/* AQI + UV */}
        <div className="space-y-6">
          <AirQualityCard />
          <UVIndexCard />
        </div>
      </div>

      {/* Hourly Forecast */}
      <HourlyForecast />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HourlyTempChart />
        <PrecipChart />
      </div>

      {/* 7-Day Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DailyForecast />
        </div>
        <div className="space-y-6">
          <SunriseSunset />
          <PrecipitationCard />
        </div>
      </div>

      {/* Details row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeatherDetails />
        <WindCompass />
      </div>

      {/* Weekly chart */}
      <WeeklyChart />
    </motion.div>
  );
}
