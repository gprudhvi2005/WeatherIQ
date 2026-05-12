import { useState, useEffect } from 'react';

/**
 * Custom hook for browser geolocation
 * Returns { latitude, longitude, error, loading, retry }
 */
export function useGeolocation() {
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const getPosition = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        let message = 'Unable to retrieve your location';
        switch (err.code) {
          case err.PERMISSION_DENIED:
            message = 'Location access denied. Please enable location permissions.';
            break;
          case err.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable.';
            break;
          case err.TIMEOUT:
            message = 'Location request timed out.';
            break;
        }
        setError(message);
        setLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      }
    );
  };

  useEffect(() => {
    getPosition();
  }, []);

  return { ...position, error, loading, retry: getPosition };
}
