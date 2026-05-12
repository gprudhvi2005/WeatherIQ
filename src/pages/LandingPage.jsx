import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCloud, FiMapPin, FiBell, FiBarChart2, FiShield, FiSmartphone } from 'react-icons/fi';

const features = [
  { icon: FiCloud, title: 'Real-Time Weather', desc: 'Live weather data from high-resolution forecast models worldwide.' },
  { icon: FiMapPin, title: 'City Search', desc: 'Search any city globally with instant autocomplete suggestions.' },
  { icon: FiBell, title: 'Smart Alerts', desc: 'Get email notifications for rain, extreme heat, and custom thresholds.' },
  { icon: FiBarChart2, title: 'Charts & Analytics', desc: 'Interactive temperature and precipitation charts with hourly data.' },
  { icon: FiShield, title: 'Air Quality', desc: 'Monitor AQI, PM2.5, and pollution levels in real-time.' },
  { icon: FiSmartphone, title: 'Mobile Friendly', desc: 'Beautiful responsive design that works perfectly on any device.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-950 via-primary-950 to-surface-950 overflow-hidden">
      {/* Decorative */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div className="absolute top-20 right-20 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 15, repeat: Infinity }} />
        <motion.div className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }} transition={{ duration: 20, repeat: Infinity }} />
      </div>

      {/* Nav */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🌤️</span>
          <span className="text-2xl font-bold text-white">WeatherIQ</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="px-4 py-2 text-white/70 hover:text-white transition-colors font-medium">Sign In</Link>
          <Link to="/register" className="btn-primary text-sm">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8">
            <span className="text-sm text-primary-300 font-medium">🚀 Powered by Open-Meteo • 100% Free</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6">
            Weather Intelligence<br />
            <span className="gradient-text">Reimagined</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10 text-balance">
            Premium weather forecasts, air quality monitoring, and smart email alerts — all in one beautiful platform.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/dashboard" className="btn-primary text-lg px-8 py-4">
              Launch Dashboard →
            </Link>
            <Link to="/register" className="btn-secondary text-lg px-8 py-4 !bg-white/10 !text-white !border-white/20 hover:!bg-white/20">
              Create Account
            </Link>
          </div>
        </motion.div>

        {/* Hero illustration */}
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-20 mx-auto max-w-4xl">
          <div className="glass-card-strong p-8 grid grid-cols-3 gap-6">
            <div className="col-span-2 glass-card p-6 text-left">
              <p className="text-white/50 text-sm mb-2">Current Temperature</p>
              <p className="text-6xl font-extralight text-white">28°</p>
              <p className="text-white/70 mt-2">Partly Cloudy</p>
              <div className="flex gap-4 mt-3 text-sm text-white/50">
                <span>H: 32°</span><span>L: 22°</span><span>Feels 30°</span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="glass-card p-4 flex-1 text-center">
                <p className="text-white/50 text-xs">AQI</p>
                <p className="text-2xl font-bold text-green-400 mt-1">42</p>
                <p className="text-xs text-green-400">Good</p>
              </div>
              <div className="glass-card p-4 flex-1 text-center">
                <p className="text-white/50 text-xs">UV</p>
                <p className="text-2xl font-bold text-yellow-400 mt-1">5.2</p>
                <p className="text-xs text-yellow-400">Moderate</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-3xl font-bold text-white text-center mb-16">
          Everything you need to <span className="gradient-text">stay ahead of the weather</span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass-card p-6 hover:bg-white/10 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center mb-4 group-hover:bg-primary-500/30 transition-colors">
                <f.icon className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-white/50">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm text-white/40">
          <span>© 2025 WeatherIQ. Data from Open-Meteo.</span>
          <span>Built with React + Supabase</span>
        </div>
      </footer>
    </div>
  );
}
