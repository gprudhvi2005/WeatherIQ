import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Detect if user's locale uses Fahrenheit (US, Liberia, Cayman Islands, etc.)
 */
function detectUnit() {
  try {
    const locale = navigator.language || 'en';
    const fahrenheitLocales = ['en-US', 'en-LR', 'en-KY', 'en-BS', 'en-BZ', 'en-PW', 'en-FM', 'en-MH'];
    if (fahrenheitLocales.some((l) => locale.startsWith(l))) return 'fahrenheit';
    // Also check the region subtag
    const region = locale.split('-')[1]?.toUpperCase();
    if (['US', 'LR', 'KY', 'BS', 'BZ', 'PW', 'FM', 'MH'].includes(region)) return 'fahrenheit';
  } catch {}
  return 'celsius';
}

const useThemeStore = create(
  persist(
    (set, get) => ({
      isDark: true, // Default to dark mode
      unit: null,   // null = not yet initialized, will be auto-detected

      toggle: () => {
        const newValue = !get().isDark;
        set({ isDark: newValue });
        if (newValue) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      toggleUnit: () => {
        set({ unit: get().unit === 'celsius' ? 'fahrenheit' : 'celsius' });
      },

      setUnit: (unit) => set({ unit }),

      // Initialize theme + unit from stored preference or auto-detect
      initialize: () => {
        const { isDark, unit } = get();
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        // Auto-detect unit on first visit (unit will be null)
        if (!unit) {
          set({ unit: detectUnit() });
        }
      },
    }),
    {
      name: 'weatheriq-theme',
    }
  )
);

export default useThemeStore;
