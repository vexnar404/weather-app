import { createContext, useContext, useState, useEffect } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { fetchCurrentAndHourlyData } from '../services/weatherService';

const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const { location, error: locationError, isLoading: locationLoading } = useGeolocation();
  
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFahrenheit, setIsFahrenheit] = useState(false);

  useEffect(() => {
    if (!location.latitude || !location.longitude) return;

    const loadWeather = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCurrentAndHourlyData(location.latitude, location.longitude);
        setWeatherData(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch weather data. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadWeather();
  }, [location]);

  const globalLoading = locationLoading || isLoading;
  const globalError = locationError && !weatherData ? locationError : error;

  return (
    <WeatherContext.Provider 
      value={{ 
        weatherData, 
        isLoading: globalLoading, 
        error: globalError, 
        isFahrenheit, 
        setIsFahrenheit 
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => useContext(WeatherContext);