import { useState, useEffect } from 'react';

export const useGeolocation = () => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // IP
    const fetchIpLocation = async () => {
      try {
        const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        setLocation({
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
        });
        setError('Browser GPS denied. Using IP location.');
      } catch (ipErr) {
        console.error('IP Geolocation failed:', ipErr);

        setLocation({ latitude: 28.6139, longitude: 77.2090 }); 
        setError('All location services failed. Showing default.');
      } finally {
        setIsLoading(false);
      }
    };

    if (!navigator.geolocation) {
      fetchIpLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (err) => {
        console.warn('GPS denied. Falling back to IP:', err.message);
        fetchIpLocation();
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: Infinity,
      }
    );
  }, []);

  return { location, error, isLoading };
};