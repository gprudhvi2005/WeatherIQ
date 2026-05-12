import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiUser, FiLogOut, FiBookmark, FiBell, FiCloud } from 'react-icons/fi';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';
import useAuthStore from '../../store/authStore';
import useThemeStore from '../../store/themeStore';
import { isSupabaseConfigured } from '../../lib/supabaseClient';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuthStore();
  const { unit, toggleUnit } = useThemeStore();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: FiCloud },
    { path: '/saved-cities', label: 'Saved Cities', icon: FiBookmark, auth: true },
    { path: '/alerts', label: 'Alerts', icon: FiBell, auth: true },
  ];

  const filteredLinks = navLinks.filter(l => !l.auth || user || !isSupabaseConfigured);

  const handleSignOut = async () => {
    try { await signOut(); navigate('/'); } catch {}
  };

  return (
    <nav className="sticky top-0 z-50 w-full">
      <div className="backdrop-blur-2xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2 flex-shrink-0">
              <span className="text-2xl">🌤️</span>
              <span className="font-bold text-xl text-white hidden sm:block">WeatherIQ</span>
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-md hidden md:block">
              <SearchBar />
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-2">
              {filteredLinks.map(link => (
                <Link key={link.path} to={link.path}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}>
                  {link.label}
                </Link>
              ))}
              <ThemeToggle className="ml-2" />
              <button onClick={toggleUnit}
                className="ml-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-white/70 hover:text-white bg-white/10 hover:bg-white/20 transition-all"
                title="Toggle temperature unit">
                {unit === 'fahrenheit' ? '°F' : '°C'}
              </button>
              {isSupabaseConfigured && (
                user ? (
                  <div className="flex items-center gap-2 ml-2">
                    <Link to="/profile" className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all">
                      <FiUser className="w-5 h-5" />
                    </Link>
                    <button onClick={handleSignOut} className="p-2 rounded-xl text-white/70 hover:text-red-400 hover:bg-white/10 transition-all">
                      <FiLogOut className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="ml-2 btn-primary text-sm py-2 px-4">Sign In</Link>
                )
              )}
            </div>

            {/* Mobile menu button */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-white">
              {mobileOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden backdrop-blur-2xl bg-surface-900/95 border-b border-white/10 overflow-hidden">
            <div className="px-4 py-4 space-y-3">
              <SearchBar />
              {filteredLinks.map(link => (
                <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    location.pathname === link.path ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'
                  }`}>
                  <link.icon className="w-5 h-5" />{link.label}
                </Link>
              ))}
              <div className="flex items-center justify-between px-4 pt-2">
                <span className="text-white/50 text-sm">Theme</span>
                <div className="flex items-center gap-2">
                  <button onClick={toggleUnit}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-white/70 bg-white/10">
                    {unit === 'fahrenheit' ? '°F' : '°C'}
                  </button>
                  <ThemeToggle />
                </div>
              </div>
              {isSupabaseConfigured && !user && (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-center btn-primary mx-4">Sign In</Link>
              )}
              {isSupabaseConfigured && user && (
                <div className="flex gap-2 px-4">
                  <Link to="/profile" onClick={() => setMobileOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 text-white">
                    <FiUser className="w-4 h-4" />Profile
                  </Link>
                  <button onClick={() => { handleSignOut(); setMobileOpen(false); }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/20 text-red-400">
                    <FiLogOut className="w-4 h-4" />Sign Out
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
