import { format, parseISO } from 'date-fns';
import { useWeather } from '../context/WeatherContext';
import StatCard from '../components/StatCard';
import HourlyChart from '../components/HourlyChart';
import { WiThermometer, WiStrongWind, WiHumidity, WiSunrise } from 'react-icons/wi';

export default function CurrentWeather() {
  const { weatherData, isLoading, error, isFahrenheit, setIsFahrenheit } = useWeather();

  if (isLoading) {
    return (
      <div className="p-4 flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
          <p className="text-gray-400">Locating and fetching real-time data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
        <p className="font-bold">Error loading dashboard</p>
        <p>{error}</p>
      </div>
    );
  }

  const { current } = weatherData;
  
  const formatTemp = (tempC) => {
    if (isFahrenheit) return (tempC * 9/5 + 32).toFixed(1);
    return tempC;
  };

  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    try {
      return format(parseISO(isoString), 'h:mm a');
    } catch {
      return isoString;
    }
  };

  const formatHourlyData = () => {
    if (!weatherData?.hourly) return [];
    const { time, temperature_2m, relative_humidity_2m, precipitation, wind_speed_10m } = weatherData.hourly;
    
    return time.slice(0, 24).map((t, index) => ({
      time: t,
      temperature: isFahrenheit ? (temperature_2m[index] * 9/5 + 32).toFixed(1) : temperature_2m[index],
      humidity: relative_humidity_2m[index],
      precipitation: precipitation[index],
      windSpeed: wind_speed_10m[index],
    }));
  };

  const chartData = formatHourlyData();

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Current Conditions</h1>
          <p className="text-gray-500 text-sm">Real-time data for your location</p>
        </div>
        
        <button 
          onClick={() => setIsFahrenheit(!isFahrenheit)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Switch to °{isFahrenheit ? 'C' : 'F'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Current Temperature" 
          value={formatTemp(current.temperature_2m)} 
          unit={`°${isFahrenheit ? 'F' : 'C'}`}
          icon={WiThermometer}
          subtitle={`Max: ${formatTemp(current.temperature_2m_max[0])}° | Min: ${formatTemp(current.temperature_2m_min[0])}°`}
        />
        <StatCard 
          title="Wind Speed" 
          value={current.wind_speed_10m} 
          unit="km/h"
          icon={WiStrongWind}
        />
        <StatCard 
          title="Relative Humidity" 
          value={current.relative_humidity_2m} 
          unit="%"
          icon={WiHumidity}
        />
        <StatCard 
          title="Sun Cycle" 
          value={formatTime(current.sunrise[0])} 
          unit=""
          icon={WiSunrise}
          subtitle={`Sunset: ${formatTime(current.sunset[0])}`}
        />
      </div>

      <div className="mt-12 space-y-6">
        <h2 className="text-xl font-bold text-gray-900 border-b pb-2">24-Hour Forecast</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HourlyChart 
            data={chartData} 
            title="Temperature" 
            dataKey="temperature" 
            color="#ef4444" 
            unit={`°${isFahrenheit ? 'F' : 'C'}`} 
          />
          <HourlyChart 
            data={chartData} 
            title="Precipitation" 
            dataKey="precipitation" 
            color="#3b82f6" 
            unit="mm" 
          />
          <HourlyChart 
            data={chartData} 
            title="Wind Speed" 
            dataKey="windSpeed" 
            color="#10b981" 
            unit="km/h" 
          />
          <HourlyChart 
            data={chartData} 
            title="Humidity" 
            dataKey="humidity" 
            color="#8b5cf6" 
            unit="%" 
          />
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Air Quality & Pollution</h2>
          <p className="text-gray-500 text-sm">Real-time European AQI and pollutant breakdown</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard 
            title="AQI" 
            value={current.european_aqi} 
            unit="" 
            subtitle={current.european_aqi > 50 ? 'Moderate/Poor' : 'Good'}
          />
          <StatCard 
            title="PM10" 
            value={current.pm10} 
            unit="μg/m³" 
          />
          <StatCard 
            title="PM2.5" 
            value={current.pm2_5} 
            unit="μg/m³" 
          />
          <StatCard 
            title="CO" 
            value={current.carbon_monoxide} 
            unit="μg/m³" 
          />
          <StatCard 
            title="NO2" 
            value={current.nitrogen_dioxide} 
            unit="μg/m³" 
          />
          <StatCard 
            title="SO2" 
            value={current.sulphur_dioxide} 
            unit="μg/m³" 
          />
        </div>
      </div>
    </div>
  );
}