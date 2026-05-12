import axios from 'axios';
import { API_URLS, GEOCODING_RESULTS_COUNT } from '../utils/constants';

/**
 * Search cities by name using Open-Meteo Geocoding API
 * @param {string} query - City name or postal code
 * @returns {Promise<Array>} Array of city results
 */
export async function searchCities(query) {
  if (!query || query.length < 2) return [];

  const response = await axios.get(API_URLS.GEOCODING, {
    params: {
      name: query,
      count: GEOCODING_RESULTS_COUNT,
      language: 'en',
      format: 'json',
    },
    timeout: 10000,
  });

  if (!response.data.results) return [];

  return response.data.results.map((city) => ({
    id: city.id,
    name: city.name,
    latitude: city.latitude,
    longitude: city.longitude,
    country: city.country || '',
    countryCode: city.country_code || '',
    admin1: city.admin1 || '', // State/Province
    population: city.population || 0,
    timezone: city.timezone || 'auto',
  }));
}

/**
 * Get the display name for a city result
 */
export function getCityDisplayName(city) {
  const parts = [city.name];
  if (city.admin1) parts.push(city.admin1);
  if (city.country) parts.push(city.country);
  return parts.join(', ');
}

/**
 * Reverse geocode coordinates to city name using Open-Meteo
 * (We use a nearby city search as a workaround since Open-Meteo doesn't have true reverse geocoding)
 */
export async function reverseGeocode(latitude, longitude) {
  try {
    // Use Nominatim for reverse geocoding (free, no API key)
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat: latitude,
        lon: longitude,
        format: 'json',
        zoom: 10,
      },
      headers: {
        'User-Agent': 'WeatherIQ-App/1.0',
      },
      timeout: 10000,
    });

    const data = response.data;
    return {
      name: data.address?.city || data.address?.town || data.address?.village || data.address?.county || 'Unknown',
      country: data.address?.country || '',
      countryCode: data.address?.country_code?.toUpperCase() || '',
      admin1: data.address?.state || '',
      latitude,
      longitude,
    };
  } catch {
    return {
      name: 'Current Location',
      country: '',
      countryCode: '',
      admin1: '',
      latitude,
      longitude,
    };
  }
}
