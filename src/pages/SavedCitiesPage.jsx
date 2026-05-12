import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiBookmark } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useCitiesStore from '../store/citiesStore';
import useWeatherStore from '../store/weatherStore';
import useAuthStore from '../store/authStore';
import CityCard from '../components/common/CityCard';
import { fetchWeatherPreview } from '../api/weatherApi';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export default function SavedCitiesPage() {
  const { cities, fetchCities, removeCity, loading } = useCitiesStore();
  const setLocation = useWeatherStore((s) => s.setLocation);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [previews, setPreviews] = useState({});

  useEffect(() => {
    if (isSupabaseConfigured && user) fetchCities();
  }, [user]);

  // Fetch weather previews for saved cities
  useEffect(() => {
    cities.forEach(async (city) => {
      if (!previews[city.id]) {
        try {
          const data = await fetchWeatherPreview(city.latitude, city.longitude);
          setPreviews(prev => ({ ...prev, [city.id]: data }));
        } catch {}
      }
    });
  }, [cities]);

  const handleSelect = (city) => {
    setLocation({ name: city.city_name, country: city.country, latitude: city.latitude, longitude: city.longitude, admin1: '' });
    navigate('/dashboard');
  };

  const handleRemove = async (id) => {
    try {
      await removeCity(id);
      setPreviews(prev => { const p = { ...prev }; delete p[id]; return p; });
      toast.success('City removed');
    } catch { toast.error('Failed to remove'); }
  };

  if (!isSupabaseConfigured) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
        <FiBookmark className="w-16 h-16 text-white/20 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Saved Cities</h2>
        <p className="text-white/50">Configure Supabase to save your favorite cities.</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Saved Cities</h1>
          <p className="text-white/50 mt-1">{cities.length} cities saved</p>
        </div>
      </div>

      {cities.length === 0 ? (
        <div className="text-center py-20">
          <FiBookmark className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No saved cities yet</h3>
          <p className="text-white/50 mb-6">Search for a city on the dashboard and save it.</p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">Go to Dashboard</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {cities.map((city, i) => (
              <CityCard key={city.id} city={city} weather={previews[city.id]} 
                onSelect={handleSelect} onRemove={handleRemove} index={i} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
