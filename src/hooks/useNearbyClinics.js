import { useState, useEffect } from 'react';

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

/**
 * Custom hook to fetch nearby veterinary clinics using Overpass API
 * @param {Object} userLocation - User's location {lat, lng}
 * @param {number} radius - Search radius in meters (default: 5000m = 5km)
 * @returns {Object} { clinics, loading, error }
 */
export const useNearbyClinics = (userLocation, radius = 5000) => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userLocation) return;

    const fetchClinics = async () => {
      setLoading(true);
      setError(null);

      try {
        // Overpass API query to find veterinary clinics
        // Query format: find all nodes, ways, and relations with amenity=veterinary
        const query = `
          [out:json][timeout:25];
          (
            node["amenity"="veterinary"](around:${radius},${userLocation.lat},${userLocation.lng});
            way["amenity"="veterinary"](around:${radius},${userLocation.lat},${userLocation.lng});
            relation["amenity"="veterinary"](around:${radius},${userLocation.lat},${userLocation.lng});
          );
          out body;
          >;
          out skel qt;
        `;

        const response = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          body: query,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch clinics from Overpass API');
        }

        const data = await response.json();
        
        // Process the results
        const clinicData = data.elements
          .filter(element => element.tags && element.tags.amenity === 'veterinary')
          .map(element => {
            // For ways and relations, use center coordinates if available
            const lat = element.lat || element.center?.lat;
            const lon = element.lon || element.center?.lon;

            if (!lat || !lon) return null;

            // Calculate distance from user location
            const distance = calculateDistance(
              userLocation.lat,
              userLocation.lng,
              lat,
              lon
            );

            return {
              id: element.id,
              name: element.tags.name || 'Unnamed Veterinary Clinic',
              address: [
                element.tags['addr:street'],
                element.tags['addr:housenumber'],
                element.tags['addr:city'],
                element.tags['addr:postcode']
              ]
                .filter(Boolean)
                .join(', ') || 'Address not available',
              phone: element.tags.phone || element.tags['contact:phone'] || 'N/A',
              website: element.tags.website || element.tags['contact:website'] || null,
              opening_hours: element.tags.opening_hours || 'Not available',
              lat,
              lon,
              distance: distance.toFixed(2), // Distance in km with 2 decimal places
            };
          })
          .filter(clinic => clinic !== null)
          // Sort by distance (nearest first)
          .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

        setClinics(clinicData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchClinics();
  }, [userLocation, radius]);

  return { clinics, loading, error };
};
