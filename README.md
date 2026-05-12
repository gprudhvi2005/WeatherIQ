# WeatherIQ — Weather Intelligence Platform

A production-ready, full-stack weather intelligence web application built with **React + Vite + TailwindCSS** frontend and **Supabase** backend.

![Weather Dashboard](https://img.shields.io/badge/React-18-blue) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4) ![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ECF8E) ![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)

## Features

- 🌡️ **Real-time Weather** — Current conditions, feels like, min/max temperatures
- 📊 **Hourly & 7-Day Forecast** — Interactive charts with Recharts
- 💨 **Air Quality Index (AQI)** — PM2.5, PM10, pollutant monitoring
- 🌅 **Sunrise/Sunset** — Animated sun arc with real-time position
- 🧭 **Wind Compass** — Animated directional compass with gusts
- ☀️ **UV Index** — Color-coded scale with health advice
- 🔍 **City Search** — Debounced autocomplete with global coverage
- 📌 **Saved Cities** — Persistent favorites with weather previews
- 🔐 **Authentication** — Sign up, login, forgot password via Supabase Auth
- 📧 **Email Weather Alerts** — Automated alerts for heat/rain via Edge Functions
- 🌙 **Dark/Light Theme** — Persisted theme preference
- 📱 **Responsive Design** — Mobile-first, works on all devices
- 🎨 **Dynamic Backgrounds** — Weather-condition-based gradients
- ⚡ **Performance** — Code splitting, lazy loading, optimized bundles

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TailwindCSS 3 |
| Routing | React Router v6 |
| State | Zustand |
| Animations | Framer Motion |
| Charts | Recharts |
| Icons | React Icons |
| HTTP | Axios |
| Auth & DB | Supabase (Auth, PostgreSQL, Edge Functions) |
| Weather API | Open-Meteo (free, no API key) |
| Geocoding | Open-Meteo Geocoding + Nominatim |
| Email | Gmail SMTP (App Password) |
| Deploy | Vercel |

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- A [Supabase](https://supabase.com) project (free tier)
- A Gmail account with an App Password (optional, for email alerts)

### 1. Clone & Install

```bash
git clone <your-repo>
cd calendar2.0
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> **Note:** The app works without Supabase for weather browsing. Auth, saved cities, and alerts require Supabase.

### 3. Setup Supabase Database

1. Go to your Supabase project → SQL Editor
2. Copy the contents of `supabase/schema.sql`
3. Run the SQL to create tables, RLS policies, and triggers

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── api/                    # API clients (weather, geocoding)
├── components/
│   ├── charts/            # Recharts visualizations
│   ├── common/            # Shared UI components
│   └── weather/           # Weather display components
├── hooks/                 # Custom React hooks
├── layouts/               # Page layouts
├── lib/                   # Supabase client
├── pages/                 # Route pages
├── services/              # Supabase data services
├── store/                 # Zustand stores
├── styles/                # Additional styles
└── utils/                 # Utilities & constants

supabase/
├── schema.sql             # Database schema
└── functions/
    └── send-weather-alerts/
        └── index.ts       # Edge function for email alerts
```

## Weather Alert System

### How it works:
1. Users configure alert thresholds (temperature > X°C, rain > Y%)
2. A Supabase Edge Function runs every 30 minutes via pg_cron
3. It fetches live weather data for all configured cities
4. When thresholds are exceeded, it sends email alerts via your **personal Gmail**
5. Alerts are deduplicated (no repeat alerts within 6 hours)

### Gmail Setup:
1. Go to [myaccount.google.com](https://myaccount.google.com) → Security
2. Enable **2-Step Verification** (required for App Passwords)
3. Go to **App passwords** → Create one for "Mail" → Copy the 16-character password

### Deploy:
1. Deploy the edge function: `supabase functions deploy send-weather-alerts`
2. Set secrets in Supabase Edge Functions:
   ```bash
   supabase secrets set GMAIL_USER=yourname@gmail.com
   supabase secrets set GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
   supabase secrets set PROJECT_URL=https://your-project-ref.supabase.co
   supabase secrets set SERVICE_ROLE_KEY=your-service-role-key
   ```
3. Enable pg_cron and pg_net extensions in Supabase dashboard
4. Run the cron SQL from `schema.sql` (uncomment the cron section)

### Run Now (Manual Trigger)
- The Alerts page has a “Run Now” button to trigger alerts immediately.
- Manual runs are scoped to the logged-in user and bypass the 6-hour dedupe.

## Deployment (Vercel)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo>
git push -u origin main
```

### 2. Deploy to Vercel

1. Import project on [vercel.com](https://vercel.com)
2. Set environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy!

The `vercel.json` handles SPA routing automatically.

## APIs Used (All Free)

| API | Purpose | Rate Limit |
|-----|---------|------------|
| [Open-Meteo Forecast](https://open-meteo.com) | Weather data | 10,000 req/day |
| [Open-Meteo Air Quality](https://open-meteo.com/en/docs/air-quality-api) | AQI data | 10,000 req/day |
| [Open-Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api) | City search | 10,000 req/day |
| [Nominatim](https://nominatim.org) | Reverse geocoding | 1 req/sec |
| Gmail SMTP | Email alerts | 500 emails/day |


