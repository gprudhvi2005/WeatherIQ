import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WiDaySunny } from 'react-icons/wi';
import { FiSearch, FiX, FiMapPin } from 'react-icons/fi';
import { searchCities, getCityDisplayName } from '../../api/geocodingApi';
import { useDebounce } from '../../hooks/useDebounce';
import useWeatherStore from '../../store/weatherStore';

export default function SearchBar({ className = '' }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debouncedQuery = useDebounce(query, 300);
  const setLocation = useWeatherStore((s) => s.setLocation);

  // Search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    let cancelled = false;
    setSearching(true);

    searchCities(debouncedQuery).then((cities) => {
      if (!cancelled) {
        setResults(cities);
        setSearching(false);
      }
    }).catch(() => {
      if (!cancelled) {
        setResults([]);
        setSearching(false);
      }
    });

    return () => { cancelled = true; };
  }, [debouncedQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city) => {
    setLocation({
      name: city.name,
      country: city.country,
      latitude: city.latitude,
      longitude: city.longitude,
      admin1: city.admin1,
    });
    setQuery('');
    setIsOpen(false);
    setResults([]);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search any city..."
          className="w-full pl-12 pr-10 py-3 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-xl 
                     border border-white/20 dark:border-white/10 
                     text-white placeholder-white/50 
                     focus:outline-none focus:ring-2 focus:ring-white/30
                     transition-all duration-200"
          id="city-search-input"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (results.length > 0 || searching) && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 py-2 rounded-2xl 
                       bg-white dark:bg-surface-800 
                       shadow-2xl border border-surface-200 dark:border-surface-700
                       max-h-80 overflow-y-auto"
            id="search-results-dropdown"
          >
            {searching ? (
              <div className="px-4 py-3 text-surface-500 text-sm flex items-center gap-2">
                <motion.div
                  className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
                Searching...
              </div>
            ) : (
              results.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleSelect(city)}
                  className="w-full px-4 py-3 flex items-center gap-3 
                             hover:bg-surface-100 dark:hover:bg-surface-700 
                             transition-colors text-left"
                >
                  <FiMapPin className="w-4 h-4 text-primary-500 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-surface-900 dark:text-surface-100">
                      {city.name}
                    </div>
                    <div className="text-sm text-surface-500">
                      {[city.admin1, city.country].filter(Boolean).join(', ')}
                    </div>
                  </div>
                </button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
