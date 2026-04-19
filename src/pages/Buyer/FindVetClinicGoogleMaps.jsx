import React, { useState, useEffect, useRef } from 'react';

// Add your Google Maps API key here
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyBpbydpeqqpPSNQ75l1wO5j6mDO7sxiJs0';

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Load Google Maps Script
const loadGoogleMapsScript = (callback) => {
  if (window.google && window.google.maps) {
    callback();
    return;
  }

  const existingScript = document.getElementById('googleMaps');
  if (!existingScript) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry`;
    script.id = 'googleMaps';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    script.onload = () => {
      if (callback) callback();
    };
  }
  if (existingScript && callback) callback();
};

const useUserLocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingDefault, setUsingDefault] = useState(false);

  useEffect(() => {
    // Default location (Colombo, Sri Lanka)
    const defaultLocation = { lat: 6.9271, lng: 79.8612 };

    if (!navigator.geolocation) {
      setLocation(defaultLocation);
      setUsingDefault(true);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setUsingDefault(false);
        setLoading(false);
      },
      (err) => {
        setLocation(defaultLocation);
        setUsingDefault(true);
        setError(err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 60000,
      }
    );
  }, []);

  return { location, loading, error, usingDefault };
};

const FindVetClinic = () => {
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [clinicsLoading, setClinicsLoading] = useState(false);
  const [clinicsError, setClinicsError] = useState(null);
  const [route, setRoute] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]);
  const directionsRendererRef = useRef(null);

  const { location: userLocation, loading: locationLoading, error: locationError, usingDefault } = useUserLocation();

  // Load Google Maps Script
  useEffect(() => {
    loadGoogleMapsScript(() => {
      setScriptLoaded(true);
    });
  }, []);

  // Initialize map
  useEffect(() => {
    if (!scriptLoaded || !userLocation || !mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: userLocation,
      zoom: 13,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    });

    googleMapRef.current = map;

    // Add user location marker
    new window.google.maps.Marker({
      position: userLocation,
      map: map,
      title: 'Your Location',
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#4285F4',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      },
    });

    // Search for nearby veterinary clinics
    searchNearbyClinics(map, userLocation);
  }, [scriptLoaded, userLocation]);

  const searchNearbyClinics = (map, location) => {
    setClinicsLoading(true);
    setClinicsError(null);

    const service = new window.google.maps.places.PlacesService(map);

    const request = {
      location: location,
      radius: 5000, // 5km
      type: 'veterinary_care',
      keyword: 'veterinary OR vet clinic OR animal hospital',
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const clinicData = results.map((place) => {
          const distance = calculateDistance(
            location.lat,
            location.lng,
            place.geometry.location.lat(),
            place.geometry.location.lng()
          );

          return {
            id: place.place_id,
            name: place.name,
            address: place.vicinity,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            distance: distance.toFixed(2),
            rating: place.rating || 'N/A',
            isOpen: place.opening_hours?.isOpen() ? 'Open Now' : place.opening_hours ? 'Closed' : 'Unknown',
            phone: place.formatted_phone_number || 'N/A',
            place: place,
          };
        }).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

        setClinics(clinicData);
        setClinicsLoading(false);

        // Add markers for clinics
        addClinicMarkers(map, clinicData);
      } else {
        setClinicsError('Failed to fetch nearby clinics. Please try again.');
        setClinicsLoading(false);
      }
    });
  };

  const addClinicMarkers = (map, clinicsData) => {
    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    clinicsData.forEach((clinic) => {
      const marker = new window.google.maps.Marker({
        position: { lat: clinic.lat, lng: clinic.lng },
        map: map,
        title: clinic.name,
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        },
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 14px;">${clinic.name}</h3>
            <p style="margin: 4px 0; font-size: 12px;">📍 ${clinic.address}</p>
            <p style="margin: 4px 0; font-size: 12px; color: #1976d2; font-weight: bold;">${clinic.distance} km away</p>
            ${clinic.rating !== 'N/A' ? `<p style="margin: 4px 0; font-size: 12px;">⭐ ${clinic.rating}</p>` : ''}
            ${clinic.isOpen !== 'Unknown' ? `<p style="margin: 4px 0; font-size: 12px;">${clinic.isOpen}</p>` : ''}
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
        handleClinicSelect(clinic);
      });

      markersRef.current.push(marker);
    });
  };

  const handleClinicSelect = async (clinic) => {
    setSelectedClinic(clinic);
    setRoute(null);
    setRouteLoading(true);

    if (!googleMapRef.current || !userLocation) return;

    // Clear previous route
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
    }

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      map: googleMapRef.current,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#4285F4',
        strokeWeight: 5,
        strokeOpacity: 0.7,
      },
    });

    directionsRendererRef.current = directionsRenderer;

    const request = {
      origin: userLocation,
      destination: { lat: clinic.lat, lng: clinic.lng },
      travelMode: window.google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result);
        const route = result.routes[0].legs[0];
        setRoute({
          distance: route.distance.text,
          duration: route.duration.text,
        });
        setRouteLoading(false);

        // Center map on route
        googleMapRef.current.fitBounds(result.routes[0].bounds);
      } else {
        console.error('Directions request failed:', status);
        setRouteLoading(false);
      }
    });
  };

  const handleClearSelection = () => {
    setSelectedClinic(null);
    setRoute(null);

    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
    }

    if (googleMapRef.current && userLocation) {
      googleMapRef.current.setCenter(userLocation);
      googleMapRef.current.setZoom(13);
    }
  };

  if (locationLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Getting your location...</p>
          <p className="text-sm text-gray-500 mt-2">Please allow location access in your browser</p>
        </div>
      </div>
    );
  }

  if (!scriptLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  if (!userLocation) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-96 bg-white shadow-lg overflow-y-auto">
        <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <h1 className="text-2xl font-bold mb-2">Nearby Vet Clinics</h1>
          <p className="text-sm opacity-90">Within 5km of your location</p>
          {usingDefault && (
            <div className="mt-2 bg-yellow-400 bg-opacity-20 border border-yellow-300 rounded p-2 text-xs">
              📍 Using default location (Colombo)
            </div>
          )}
          {locationError && (
            <div className="mt-2 bg-yellow-400 bg-opacity-20 border border-yellow-300 rounded p-2 text-xs">
              ⚠️ {locationError}
            </div>
          )}
        </div>

        {clinicsLoading && (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-3"></div>
            <p className="text-gray-600">Searching for clinics...</p>
          </div>
        )}

        {clinicsError && (
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 font-semibold mb-1">Error Loading Clinics</p>
              <p className="text-red-600 text-sm">{clinicsError}</p>
            </div>
          </div>
        )}

        {!clinicsLoading && !clinicsError && (
          <div className="p-4">
            {clinics.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No veterinary clinics found nearby</p>
                <p className="text-gray-400 text-sm mt-2">Try expanding your search area</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-3">Found {clinics.length} clinic(s)</p>
                {clinics.map((clinic) => (
                  <div
                    key={clinic.id}
                    onClick={() => handleClinicSelect(clinic)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedClinic?.id === clinic.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:shadow'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800 text-lg">{clinic.name}</h3>
                      <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                        {clinic.distance} km
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">📍 {clinic.address}</p>
                    {clinic.rating !== 'N/A' && (
                      <p className="text-sm text-gray-600 mb-1">⭐ Rating: {clinic.rating}</p>
                    )}
                    {clinic.isOpen !== 'Unknown' && (
                      <p className={`text-xs font-semibold ${clinic.isOpen === 'Open Now' ? 'text-green-600' : 'text-red-600'}`}>
                        {clinic.isOpen}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedClinic && (
          <div className="p-4 border-t-2 border-gray-200 bg-gray-50">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-gray-800">Route Information</h3>
              <button
                onClick={handleClearSelection}
                className="text-sm text-red-600 hover:text-red-700 font-semibold"
              >
                Clear
              </button>
            </div>

            {routeLoading && (
              <div className="text-center py-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Calculating route...</p>
              </div>
            )}

            {route && !routeLoading && (
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Distance:</span>
                  <span className="font-semibold text-gray-800">{route.distance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Duration:</span>
                  <span className="font-semibold text-gray-800">{route.duration}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        
        <div className="absolute bottom-6 right-6 bg-white rounded-lg shadow-lg p-4 z-10">
          <h4 className="font-bold text-gray-800 mb-2 text-sm">Legend</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-gray-700">Your Location</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-red-500 rounded-full mr-2"></div>
              <span className="text-gray-700">Vet Clinic</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-1 bg-blue-600 mr-2"></div>
              <span className="text-gray-700">Route</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindVetClinic;
