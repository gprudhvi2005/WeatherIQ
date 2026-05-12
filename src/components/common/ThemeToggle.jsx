import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import useThemeStore from '../../store/themeStore';

export default function ThemeToggle({ className = '' }) {
  const { isDark, toggle } = useThemeStore();

  return (
    <button
      onClick={toggle}
      className={`relative w-14 h-8 rounded-full p-1 transition-colors duration-300 
                  ${isDark ? 'bg-primary-600' : 'bg-yellow-400'} 
                  ${className}`}
      aria-label="Toggle theme"
      id="theme-toggle"
    >
      <motion.div
        className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center"
        animate={{ x: isDark ? 22 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {isDark ? (
          <FiMoon className="w-3.5 h-3.5 text-primary-600" />
        ) : (
          <FiSun className="w-3.5 h-3.5 text-yellow-500" />
        )}
      </motion.div>
    </button>
  );
}
