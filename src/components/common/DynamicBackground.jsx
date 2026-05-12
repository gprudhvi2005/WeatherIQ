import { motion } from 'framer-motion';
import useThemeStore from '../../store/themeStore';

export default function DynamicBackground({ children }) {
  const isDark = useThemeStore((s) => s.isDark);

  // Consistent palette: dark navy/purple for dark mode, rich blue sky for light mode
  const gradient = isDark
    ? 'from-[#0a0e1a] via-[#131832] to-[#1a1145]'
    : 'from-[#1e3a5f] via-[#2563eb] to-[#3b82f6]';

  return (
    <div className="relative min-h-screen">
      {/* Gradient background — same color for every city */}
      <motion.div
        className={`fixed inset-0 bg-gradient-to-br ${gradient} -z-10`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Decorative orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className={`absolute top-20 right-20 w-96 h-96 rounded-full blur-3xl ${
            isDark ? 'bg-primary-500/8' : 'bg-white/10'
          }`}
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className={`absolute bottom-20 left-20 w-80 h-80 rounded-full blur-3xl ${
            isDark ? 'bg-violet-500/8' : 'bg-sky-200/15'
          }`}
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl ${
            isDark ? 'bg-indigo-900/10' : 'bg-sky-300/10'
          }`}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Stars for dark mode */}
        {isDark && (
          <>
            {[...Array(25)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${(i * 37 + 13) % 100}%`,
                  top: `${(i * 23 + 7) % 60}%`,
                }}
                animate={{ opacity: [0.15, 0.6, 0.15], scale: [1, 1.4, 1] }}
                transition={{
                  duration: 2.5 + (i % 4),
                  repeat: Infinity,
                  delay: (i % 5) * 0.5,
                }}
              />
            ))}
          </>
        )}
      </div>

      {children}
    </div>
  );
}
