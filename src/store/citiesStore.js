import { create } from 'zustand';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import * as citiesService from '../services/citiesService';

const useCitiesStore = create((set, get) => ({
  cities: [],
  loading: false,
  error: null,

  // Fetch saved cities from Supabase
  fetchCities: async () => {
    if (!isSupabaseConfigured) return;
    
    set({ loading: true, error: null });
    try {
      const cities = await citiesService.fetchSavedCities();
      set({ cities, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Add a city to saved list
  addCity: async ({ cityName, latitude, longitude, country }) => {
    if (!isSupabaseConfigured) return;

    set({ error: null });
    try {
      const newCity = await citiesService.saveCity({ cityName, latitude, longitude, country });
      set((state) => ({ cities: [newCity, ...state.cities] }));
      return newCity;
    } catch (err) {
      // Handle unique constraint violation
      if (err.message?.includes('duplicate') || err.code === '23505') {
        set({ error: 'City already saved' });
      } else {
        set({ error: err.message });
      }
      throw err;
    }
  },

  // Remove a city from saved list
  removeCity: async (cityId) => {
    if (!isSupabaseConfigured) return;

    set({ error: null });
    try {
      await citiesService.removeCity(cityId);
      set((state) => ({
        cities: state.cities.filter((c) => c.id !== cityId),
      }));
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  // Check if city is already saved
  isCitySaved: (cityName) => {
    return get().cities.some(
      (c) => c.city_name?.toLowerCase() === cityName?.toLowerCase()
    );
  },
}));

export default useCitiesStore;
