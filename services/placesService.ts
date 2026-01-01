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

const PLACES_API_BASE = 'https://places.googleapis.com/v1';

/**
 * Search for boba/bubble tea places near a location using Places API (New)
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
    if (__DEV__) {
      console.warn('Google Places API key not configured');
    }
    return [];
  }

  // Debug: Log that API key is present (never log the actual key)
  if (__DEV__) {
    console.log('🔑 Google Places API key configured:', !!apiKey);
  }

  try {
    const requestBody: Record<string, unknown> = {
      textQuery: `${query} boba tea`,
      maxResultCount: 10,
    };

    // Add location bias if available
    if (location) {
      requestBody.locationBias = {
        circle: {
          center: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          radius: 10000.0,
        },
      };
    }

    const response = await fetch(`${PLACES_API_BASE}/places:searchText`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (data.error) {
      // Only log errors in development
      if (__DEV__) {
        console.error('Places API error:', data.error.message, data.error.status);
      }
      return [];
    }

    return (data.places || []).map((place: Record<string, unknown>) => ({
      placeId: (place.id as string) || '',
      name: (place.displayName as Record<string, string>)?.text || '',
      address: (place.formattedAddress as string) || '',
      distance: undefined,
    }));
  } catch (error) {
    if (__DEV__) {
      console.error('Error searching places:', error);
    }
    return [];
  }
};

/**
 * Get details for a specific place using Places API (New)
 */
export const getPlaceDetails = async (placeId: string): Promise<PlaceDetails | null> => {
  const apiKey = getGooglePlacesApiKey();
  if (!apiKey) {
    return null;
  }

  try {
    const response = await fetch(`${PLACES_API_BASE}/places/${placeId}`, {
      method: 'GET',
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'id,displayName,formattedAddress,location',
      },
    });

    const data = await response.json();

    if (data.error) {
      if (__DEV__) {
        console.error('Place details error:', data.error.message);
      }
      return null;
    }

    return {
      placeId: data.id || placeId,
      name: data.displayName?.text || '',
      address: data.formattedAddress || '',
      latitude: data.location?.latitude || 0,
      longitude: data.location?.longitude || 0,
    };
  } catch (error) {
    if (__DEV__) {
      console.error('Error getting place details:', error);
    }
    return null;
  }
};

/**
 * Search for nearby boba places without a query (discovery) using Places API (New)
 */
export const searchNearbyBobaPlaces = async (location: Coordinates): Promise<PlacePrediction[]> => {
  const apiKey = getGooglePlacesApiKey();
  if (!apiKey) {
    return [];
  }

  try {
    const requestBody = {
      includedTypes: ['cafe', 'restaurant', 'food'],
      maxResultCount: 10,
      locationRestriction: {
        circle: {
          center: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          radius: 5000.0,
        },
      },
    };

    const response = await fetch(`${PLACES_API_BASE}/places:searchNearby`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (data.error) {
      if (__DEV__) {
        console.error('Nearby search error:', data.error.message);
      }
      return [];
    }

    return (data.places || []).map((place: Record<string, unknown>) => ({
      placeId: (place.id as string) || '',
      name: (place.displayName as Record<string, string>)?.text || '',
      address: (place.formattedAddress as string) || '',
      distance: undefined,
    }));
  } catch (error) {
    if (__DEV__) {
      console.error('Error searching nearby places:', error);
    }
    return [];
  }
};
