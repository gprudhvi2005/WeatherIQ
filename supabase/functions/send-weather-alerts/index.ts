// Supabase Edge Function: send-weather-alerts
// Triggered by pg_cron every 30 minutes
// Fetches weather for all alert preferences and sends email via Gmail SMTP

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';

// Environment variables (set via `supabase secrets set`)
const GMAIL_USER = Deno.env.get('GMAIL_USER');         // e.g. yourname@gmail.com
const GMAIL_APP_PASSWORD = Deno.env.get('GMAIL_APP_PASSWORD'); // 16-char App Password
const SUPABASE_URL = Deno.env.get('PROJECT_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SERVICE_ROLE_KEY');

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Fetch weather from Open-Meteo
async function fetchWeather(lat: number, lon: number) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&daily=temperature_2m_max,precipitation_probability_max&timezone=auto&forecast_days=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
  return await res.json();
}

// Send email via Gmail SMTP using App Password
async function sendEmail(to: string, subject: string, html: string) {
  const client = new SMTPClient({
    connection: {
      hostname: 'smtp.gmail.com',
      port: 465,
      tls: true,
      auth: {
        username: GMAIL_USER,
        password: GMAIL_APP_PASSWORD,
      },
    },
  });

  try {
    await client.send({
      from: GMAIL_USER,
      to: to,
      subject: subject,
      content: '',       // plain text fallback
      html: html,        // rich HTML email
    });

    await client.close();
    console.log(`[EMAIL] Sent to ${to}: ${subject}`);
  } catch (err) {
    console.error(`[EMAIL ERROR] Failed to send to ${to}:`, err.message);
    try { await client.close(); } catch {}
    throw err;
  }
}

// Check if we already sent an alert for this city + type in the last 6 hours
async function wasRecentlyAlerted(userId: string, cityName: string, alertType: string) {
  const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();

  const { data } = await supabase
    .from('weather_alert_logs')
    .select('id')
    .eq('user_id', userId)
    .eq('city_name', cityName)
    .eq('alert_type', alertType)
    .gte('sent_at', sixHoursAgo)
    .limit(1);

  return data && data.length > 0;
}

// Log an alert
async function logAlert(userId: string, cityName: string, alertType: string, message: string) {
  await supabase.from('weather_alert_logs').insert({
    user_id: userId,
    city_name: cityName,
    alert_type: alertType,
    message,
  });
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    console.log('[START] Weather alerts check');

    const payload = req.method === 'POST' ? await req.json().catch(() => ({})) : {};
    const force = Boolean(payload?.force);

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase service role configuration');
    }
    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
      throw new Error('Missing Gmail SMTP configuration');
    }

    // Fetch all active alert preferences with email enabled
    const { data: prefs, error: prefsError } = await supabase
      .from('weather_alert_preferences')
      .select('*')
      .eq('email_enabled', true);

    if (prefsError) throw prefsError;
    if (!prefs || prefs.length === 0) {
      return new Response(JSON.stringify({ message: 'No active alerts' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const userIds = Array.from(new Set(prefs.map((pref) => pref.user_id).filter(Boolean)));
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email')
      .in('id', userIds);

    if (profilesError) throw profilesError;

    const emailByUserId = new Map((profiles || []).map((profile) => [profile.id, profile.email]));

    console.log(`[INFO] Processing ${prefs.length} alert preferences`);

    let alertsSent = 0;

    for (const pref of prefs) {
      try {
        const weather = await fetchWeather(pref.latitude, pref.longitude);
        const currentTemp = weather.current?.temperature_2m;
        const maxTemp = weather.daily?.temperature_2m_max?.[0];
        const rainProb = weather.daily?.precipitation_probability_max?.[0];
        const userEmail = emailByUserId.get(pref.user_id);

        if (!userEmail) continue;

        // Check heat alert
        if (pref.alert_heat && maxTemp && maxTemp > pref.temperature_threshold) {
          const alreadySent = force ? false : await wasRecentlyAlerted(pref.user_id, pref.city_name, 'heat');
          if (!alreadySent) {
            const subject = `🌡️ Heat Alert: ${pref.city_name} — ${Math.round(maxTemp)}°C`;
            const html = `
              <div style="font-family: 'Inter', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; background: #0f172a; border-radius: 16px;">
                <h2 style="color: #ef4444; margin-bottom: 16px;">🌡️ Extreme Heat Warning</h2>
                <p style="color: #e2e8f0;">Temperature in <strong>${pref.city_name}</strong> is expected to reach <strong style="color: #f97316;">${Math.round(maxTemp)}°C</strong> today.</p>
                <p style="color: #94a3b8;">Your threshold: ${pref.temperature_threshold}°C</p>
                <p style="color: #64748b; font-size: 12px;">Current temperature: ${Math.round(currentTemp)}°C</p>
                <hr style="border: 1px solid #1e293b; margin: 16px 0;" />
                <p style="color: #475569; font-size: 12px;">— WeatherIQ Alerts</p>
              </div>
            `;
            await sendEmail(userEmail, subject, html);
            await logAlert(pref.user_id, pref.city_name, 'heat', `Temperature ${Math.round(maxTemp)}°C exceeds ${pref.temperature_threshold}°C threshold`);
            alertsSent++;
          }
        }

        // Check rain alert
        if (pref.alert_rain && rainProb && rainProb > pref.rain_threshold) {
          const alreadySent = force ? false : await wasRecentlyAlerted(pref.user_id, pref.city_name, 'rain');
          if (!alreadySent) {
            const subject = `🌧️ Rain Alert: ${pref.city_name} — ${rainProb}% probability`;
            const html = `
              <div style="font-family: 'Inter', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; background: #0f172a; border-radius: 16px;">
                <h2 style="color: #3b82f6; margin-bottom: 16px;">🌧️ Rain Alert</h2>
                <p style="color: #e2e8f0;">Rain probability in <strong>${pref.city_name}</strong> is <strong style="color: #60a5fa;">${rainProb}%</strong> today.</p>
                <p style="color: #94a3b8;">Your threshold: ${pref.rain_threshold}%</p>
                <hr style="border: 1px solid #1e293b; margin: 16px 0;" />
                <p style="color: #475569; font-size: 12px;">— WeatherIQ Alerts</p>
              </div>
            `;
            await sendEmail(userEmail, subject, html);
            await logAlert(pref.user_id, pref.city_name, 'rain', `Rain probability ${rainProb}% exceeds ${pref.rain_threshold}% threshold`);
            alertsSent++;
          }
        }
      } catch (err) {
        console.error(`[ERROR] Processing alert for ${pref.city_name}:`, err.message);
      }
    }

    console.log(`[DONE] Sent ${alertsSent} alerts`);
    return new Response(JSON.stringify({ message: `Processed. Sent ${alertsSent} alerts.` }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (err) {
    console.error('[FATAL]', err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});
