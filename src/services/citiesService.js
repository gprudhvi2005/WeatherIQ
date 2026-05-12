import { requireSupabase } from '../lib/supabaseClient';

/**
 * Fetch all saved cities for the current user
 */
export async function fetchSavedCities() {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from('saved_cities')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Save a new city
 */
export async function saveCity({ cityName, latitude, longitude, country }) {
  const sb = requireSupabase();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await sb
    .from('saved_cities')
    .insert({
      user_id: user.id,
      city_name: cityName,
      latitude,
      longitude,
      country: country || '',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Remove a saved city
 */
export async function removeCity(cityId) {
  const sb = requireSupabase();
  const { error } = await sb
    .from('saved_cities')
    .delete()
    .eq('id', cityId);

  if (error) throw error;
}

/**
 * Check if a city is already saved
 */
export async function isCitySaved(cityName, latitude, longitude) {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from('saved_cities')
    .select('id')
    .eq('city_name', cityName)
    .gte('latitude', latitude - 0.01)
    .lte('latitude', latitude + 0.01)
    .gte('longitude', longitude - 0.01)
    .lte('longitude', longitude + 0.01)
    .limit(1);

  if (error) throw error;
  return data && data.length > 0;
}
