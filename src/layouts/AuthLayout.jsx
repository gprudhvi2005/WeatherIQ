import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-950 via-primary-950 to-surface-950 flex items-center justify-center p-4">
      {/* Decorative orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
      </div>
      
      <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-8">
          <span className="text-4xl">🌤️</span>
          <span className="text-3xl font-bold text-white">WeatherIQ</span>
        </Link>
        
        <div className="glass-card-strong p-8">
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
}
