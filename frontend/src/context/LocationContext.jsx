import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [coords, setCoords] = useState(null); // { lat, lng }
  const [locationName, setLocationName] = useState('');
  const [permissionStatus, setPermissionStatus] = useState('prompt'); // 'prompt', 'granted', 'denied', 'unsupported'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Check initial permission status if available
  useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setPermissionStatus(result.state);
        if (result.state === 'granted') {
          fetchCurrentPosition();
        }
        result.onchange = () => {
          setPermissionStatus(result.state);
          if (result.state === 'granted') {
            fetchCurrentPosition();
          }
        };
      }).catch(() => {});
    }
  }, []);

  const fetchCurrentPosition = () => {
    if (!('geolocation' in navigator)) {
      setPermissionStatus('unsupported');
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
        setPermissionStatus('granted');
        setLocationName('Your Current Location');
        setLoading(false);
        setErrorMsg(null);
      },
      (error) => {
        setLoading(false);
        setPermissionStatus('denied');
        if (error.code === error.PERMISSION_DENIED) {
          setErrorMsg('Location access was denied. You can still search for any location manually.');
        } else {
          setErrorMsg('Unable to retrieve your location. Try choosing a location manually.');
        }
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const setManualLocation = (name, lat, lng) => {
    setLocationName(name);
    setCoords({ lat, lng });
    setPermissionStatus('granted');
    setErrorMsg(null);
  };

  // Helper to calculate distance in km using Haversine formula
  const getDistanceTo = (destLat, destLng) => {
    if (!coords || !destLat || !destLng) return null;
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371; // Earth radius in km
    const dLat = toRad(destLat - coords.lat);
    const dLon = toRad(destLng - coords.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(coords.lat)) * Math.cos(toRad(destLat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  return (
    <LocationContext.Provider
      value={{
        coords,
        locationName,
        permissionStatus,
        loading,
        errorMsg,
        requestLocation: fetchCurrentPosition,
        setManualLocation,
        getDistanceTo,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
