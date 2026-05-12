import { requireSupabase } from '../lib/supabaseClient';

/**
 * Fetch alert preferences for the current user
 */
export async function fetchAlertPreferences() {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from('weather_alert_preferences')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Create or update an alert preference
 */
export async function upsertAlertPreference(preference) {
  const sb = requireSupabase();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const payload = {
    user_id: user.id,
    city_name: preference.cityName,
    latitude: preference.latitude,
    longitude: preference.longitude,
    alert_rain: preference.alertRain ?? false,
    alert_heat: preference.alertHeat ?? false,
    temperature_threshold: preference.temperatureThreshold ?? 38,
    rain_threshold: preference.rainThreshold ?? 70,
    email_enabled: preference.emailEnabled ?? true,
  };

  // If updating existing
  if (preference.id) {
    const { data, error } = await sb
      .from('weather_alert_preferences')
      .update(payload)
      .eq('id', preference.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // Insert new
  const { data, error } = await sb
    .from('weather_alert_preferences')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete an alert preference
 */
export async function deleteAlertPreference(preferenceId) {
  const sb = requireSupabase();
  const { error } = await sb
    .from('weather_alert_preferences')
    .delete()
    .eq('id', preferenceId);

  if (error) throw error;
}

/**
 * Fetch alert logs for the current user
 */
export async function fetchAlertLogs(limit = 20) {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from('weather_alert_logs')
    .select('*')
    .order('sent_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * Manually invoke the edge function to process alerts now
 */
export async function runAlertsNow() {
  const sb = requireSupabase();
  const { data, error } = await sb.functions.invoke('send-weather-alerts', {
    body: { force: true },
  });

  if (error) throw error;
  return data;
}
