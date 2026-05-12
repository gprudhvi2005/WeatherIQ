import { create } from 'zustand';
import { fetchAllWeatherData, fetchWeatherPreview } from '../api/weatherApi';
import { reverseGeocode } from '../api/geocodingApi';

const useWeatherStore = create((set, get) => ({
  // Current location
  location: {
    name: '',
    country: '',
    latitude: null,
    longitude: null,
    admin1: '',
  },
  
  // Weather data
  weather: null,
  airQuality: null,
  
  // UI state
  loading: false,
  error: null,
  lastUpdated: null,

  // Set location manually (from search)
  setLocation: (location) => {
    set({ location });
    get().fetchWeather(location.latitude, location.longitude);
  },

  // Detect user location via browser geolocation
  detectLocation: async () => {
    set({ loading: true, error: null });
    
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const error = 'Geolocation is not supported';
        set({ error, loading: false });
        reject(error);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            const cityInfo = await reverseGeocode(latitude, longitude);
            
            set({
              location: {
                name: cityInfo.name,
                country: cityInfo.country,
                latitude,
                longitude,
                admin1: cityInfo.admin1,
              },
            });
            
            await get().fetchWeather(latitude, longitude);
            resolve();
          } catch (err) {
            set({ error: 'Failed to detect location', loading: false });
            reject(err);
          }
        },
        (err) => {
          let message = 'Unable to get location';
          if (err.code === err.PERMISSION_DENIED) {
            message = 'Location access denied. Search for a city instead.';
          }
          set({ error: message, loading: false });
          
          // Fall back to a default city (New York)
          get().setLocation({
            name: 'New York',
            country: 'United States',
            latitude: 40.7128,
            longitude: -74.006,
            admin1: 'New York',
          });
          
          resolve();
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
      );
    });
  },

  // Fetch weather for given coordinates
  fetchWeather: async (latitude, longitude) => {
    set({ loading: true, error: null });
    
    try {
      const { weather, airQuality } = await fetchAllWeatherData(latitude, longitude);
      
      set({
        weather,
        airQuality,
        loading: false,
        lastUpdated: new Date().toISOString(),
      });
    } catch (err) {
      set({
        error: err.message || 'Failed to fetch weather data',
        loading: false,
      });
    }
  },

  // Refresh current weather data
  refresh: () => {
    const { location } = get();
    if (location.latitude && location.longitude) {
      get().fetchWeather(location.latitude, location.longitude);
    }
  },
}));

export default useWeatherStore;
