import { Coordinates } from './locationService';
import { getGooglePlacesApiKey } from '../src/config/secrets';

export interface PlacePrediction {
  placeId: string;
  name: string;
  address: string;
  distance?: string;
}

export interface PlaceDetails {
  placeId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

/**
 * Search for boba/bubble tea places near a location
 */
export const searchBobaPlaces = async (
  query: string,
  location: Coordinates | null
): Promise<PlacePrediction[]> => {
  if (!query || query.length < 2) {
    return [];
  }

  const apiKey = getGooglePlacesApiKey();
  if (!apiKey) {
    console.warn('Google Places API key not configured');
    return [];
  }

  try {
    let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&types=establishment&key=${apiKey}`;

    // Add location bias if available
    if (location) {
      url += `&location=${location.latitude},${location.longitude}&radius=10000`;
    }

    // Add keyword to prioritize boba/tea shops
    url += `&keyword=boba|bubble tea|tea shop|milk tea`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Places API error:', data.status, data.error_message);
      return [];
    }

    return (data.predictions || []).map((prediction: any) => ({
      placeId: prediction.place_id,
      name: prediction.structured_formatting?.main_text || prediction.description,
      address: prediction.structured_formatting?.secondary_text || '',
      distance: prediction.distance_meters
        ? `${(prediction.distance_meters / 1000).toFixed(1)} km`
        : undefined,
    }));
  } catch (error) {
    console.error('Error searching places:', error);
    return [];
  }
};

/**
 * Get details for a specific place
 */
export const getPlaceDetails = async (placeId: string): Promise<PlaceDetails | null> => {
  const apiKey = getGooglePlacesApiKey();
  if (!apiKey) {
    return null;
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      console.error('Place details error:', data.status);
      return null;
    }

    const result = data.result;
    return {
      placeId,
      name: result.name,
      address: result.formatted_address,
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
    };
  } catch (error) {
    console.error('Error getting place details:', error);
    return null;
  }
};

/**
 * Search for nearby boba places without a query (discovery)
 */
export const searchNearbyBobaPlaces = async (location: Coordinates): Promise<PlacePrediction[]> => {
  const apiKey = getGooglePlacesApiKey();
  if (!apiKey) {
    return [];
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=5000&keyword=boba|bubble tea|milk tea&type=cafe&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Nearby search error:', data.status);
      return [];
    }

    return (data.results || []).slice(0, 10).map((place: any) => ({
      placeId: place.place_id,
      name: place.name,
      address: place.vicinity,
      distance: undefined,
    }));
  } catch (error) {
    console.error('Error searching nearby places:', error);
    return [];
  }
};
