/**
 * Routing Service
 * Handles route fetching from user location to selected clinic
 * 
 * API Options:
 * 1. OpenRouteService (Recommended) - Free tier: 2000 requests/day
 *    Sign up at: https://openrouteservice.org/dev/#/signup
 *    After signup, get your API key from: https://openrouteservice.org/dev/#/home
 * 
 * 2. OSRM (Open Source Routing Machine) - No API key required
 *    Public instance available, but rate-limited
 *    For production, consider self-hosting: http://project-osrm.org/
 */

/**
 * Fetch route using OpenRouteService API
 * @param {Object} start - Starting coordinates {lat, lng}
 * @param {Object} end - Ending coordinates {lat, lng}
 * @param {string} apiKey - OpenRouteService API key
 * @returns {Promise<Object>} Route data with coordinates and distance
 */
export const fetchRouteOpenRouteService = async (start, end, apiKey) => {
  if (!apiKey) {
    throw new Error('OpenRouteService API key is required. Get one at https://openrouteservice.org/dev/#/signup');
  }

  try {
    const response = await fetch(
      `https://api.openrouteservice.org/v2/directions/driving-car?start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`,
      {
        headers: {
          'Authorization': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`OpenRouteService API error: ${response.status}`);
    }

    const data = await response.json();
    const route = data.features[0];
    
    return {
      coordinates: route.geometry.coordinates.map(coord => [coord[1], coord[0]]), // Convert [lng, lat] to [lat, lng]
      distance: (route.properties.segments[0].distance / 1000).toFixed(2), // Convert to km
      duration: Math.round(route.properties.segments[0].duration / 60), // Convert to minutes
    };
  } catch (error) {
    throw new Error(`Failed to fetch route from OpenRouteService: ${error.message}`);
  }
};

/**
 * Fetch route using OSRM API (No API key required)
 * @param {Object} start - Starting coordinates {lat, lng}
 * @param {Object} end - Ending coordinates {lat, lng}
 * @returns {Promise<Object>} Route data with coordinates and distance
 */
export const fetchRouteOSRM = async (start, end) => {
  try {
    // OSRM public API endpoint
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`
    );

    if (!response.ok) {
      throw new Error(`OSRM API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      throw new Error('No route found');
    }

    const route = data.routes[0];
    
    return {
      coordinates: route.geometry.coordinates.map(coord => [coord[1], coord[0]]), // Convert [lng, lat] to [lat, lng]
      distance: (route.distance / 1000).toFixed(2), // Convert to km
      duration: Math.round(route.duration / 60), // Convert to minutes
    };
  } catch (error) {
    throw new Error(`Failed to fetch route from OSRM: ${error.message}`);
  }
};

/**
 * Main route fetching function
 * Tries OSRM first (no API key needed), falls back to OpenRouteService if provided
 * @param {Object} start - Starting coordinates {lat, lng}
 * @param {Object} end - Ending coordinates {lat, lng}
 * @param {string} apiKey - Optional OpenRouteService API key
 * @returns {Promise<Object>} Route data
 */
export const fetchRoute = async (start, end, apiKey = null) => {
  try {
    // Try OSRM first (no API key needed)
    return await fetchRouteOSRM(start, end);
  } catch (osrmError) {
    console.warn('OSRM failed, trying OpenRouteService:', osrmError.message);
    
    // If OSRM fails and API key is provided, try OpenRouteService
    if (apiKey) {
      return await fetchRouteOpenRouteService(start, end, apiKey);
    }
    
    throw osrmError;
  }
};
