import { motion } from 'framer-motion';
import { getWeatherEmoji } from '../../utils/weatherCodes';

const iconAnimations = {
  float: {
    y: [0, -8, 0],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
  pulse: {
    scale: [1, 1.1, 1],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
  spin: {
    rotate: [0, 360],
    transition: { duration: 20, repeat: Infinity, ease: 'linear' },
  },
};

export default function WeatherIcon({ code, isNight = false, size = 'text-6xl', animate = true, className = '' }) {
  const emoji = getWeatherEmoji(code, isNight);

  if (!animate) {
    return <span className={`${size} ${className}`} role="img" aria-label="weather">{emoji}</span>;
  }

  return (
    <motion.span
      className={`${size} inline-block ${className}`}
      animate={iconAnimations.float}
      role="img"
      aria-label="weather"
    >
      {emoji}
    </motion.span>
  );
}
