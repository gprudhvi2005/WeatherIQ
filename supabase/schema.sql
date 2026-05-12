-- ============================================
-- WeatherIQ Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, split_part(NEW.email, '@', 1));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SAVED CITIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.saved_cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  city_name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  country TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, city_name)
);

CREATE INDEX IF NOT EXISTS idx_saved_cities_user_id ON public.saved_cities(user_id);

-- ============================================
-- WEATHER ALERT PREFERENCES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.weather_alert_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  city_name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  alert_rain BOOLEAN DEFAULT FALSE,
  alert_heat BOOLEAN DEFAULT FALSE,
  temperature_threshold INTEGER DEFAULT 38,
  rain_threshold INTEGER DEFAULT 70,
  email_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alert_prefs_user_id ON public.weather_alert_preferences(user_id);

-- ============================================
-- WEATHER ALERT LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.weather_alert_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  city_name TEXT NOT NULL,
  alert_type TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alert_logs_user_id ON public.weather_alert_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_alert_logs_sent_at ON public.weather_alert_logs(sent_at);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Saved Cities
ALTER TABLE public.saved_cities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved cities"
  ON public.saved_cities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved cities"
  ON public.saved_cities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved cities"
  ON public.saved_cities FOR DELETE
  USING (auth.uid() = user_id);

-- Alert Preferences
ALTER TABLE public.weather_alert_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own alert prefs"
  ON public.weather_alert_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own alert prefs"
  ON public.weather_alert_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alert prefs"
  ON public.weather_alert_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own alert prefs"
  ON public.weather_alert_preferences FOR DELETE
  USING (auth.uid() = user_id);

-- Alert Logs
ALTER TABLE public.weather_alert_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own alert logs"
  ON public.weather_alert_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can insert alert logs (for edge functions)
CREATE POLICY "Service role can insert alert logs"
  ON public.weather_alert_logs FOR INSERT
  WITH CHECK (true);

-- ============================================
-- CRON JOB (Run after deploying edge function)
-- Requires pg_cron and pg_net extensions enabled
-- ============================================
-- 
-- SELECT cron.schedule(
--   'weather-alerts-check',
--   '*/30 * * * *',
--   $$
--   SELECT net.http_post(
--     url := 'https://<YOUR_PROJECT_REF>.supabase.co/functions/v1/send-weather-alerts',
--     headers := jsonb_build_object(
--       'Content-Type', 'application/json',
--       'Authorization', 'Bearer <YOUR_SERVICE_ROLE_KEY>'
--     ),
--     body := '{}'::jsonb
--   ) AS request_id;
--   $$
-- );
