import React, { useState, useEffect } from 'react';
import { format, subYears, subDays } from 'date-fns';
import { useGeolocation } from '../hooks/useGeolocation';
import { fetchHistoricalData } from '../services/weatherService';
import HistoricalChart from '../components/HistoricalChart';

export default function HistoricalTrends() {
  const { location, error: locationError } = useGeolocation();
  
  const today = new Date();
  const maxAllowedDate = format(subDays(today, 1), 'yyyy-MM-dd'); 
  const minAllowedDate = format(subYears(today, 2), 'yyyy-MM-dd'); 

  const [startDate, setStartDate] = useState(format(subDays(today, 15), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(maxAllowedDate);
  
  const [historicalData, setHistoricalData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    if (!location.latitude || !location.longitude) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchHistoricalData(location.latitude, location.longitude, startDate, endDate);
      setHistoricalData(data);
    } catch (err) {
      setError('Failed to fetch historical trends. Please try a different date range.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (location.latitude) {
      loadData();
    }
  }, [location.latitude]);

  const formatChartData = () => {
    if (!historicalData?.dailyWeather) return [];
    
    const { time, temperature_2m_mean, precipitation_sum, wind_speed_10m_max } = historicalData.dailyWeather;
    
    return time.map((date, index) => ({
      time: date,
      temperature: temperature_2m_mean[index],
      precipitation: precipitation_sum[index],
      windSpeed: wind_speed_10m_max[index],
    }));
  };

  const chartData = formatChartData();

  return (
    <div className="space-y-8 animate-fade-in pb-12">

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Historical Trends</h1>
        <p className="text-gray-500 text-sm">Analyze up to 2 years of past weather data</p>
      </div>


      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex flex-col w-full md:w-auto">
          <label className="text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input 
            type="date" 
            value={startDate}
            min={minAllowedDate}
            max={endDate} 
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col w-full md:w-auto">
          <label className="text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input 
            type="date" 
            value={endDate}
            min={startDate} 
            max={maxAllowedDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <button 
          onClick={loadData}
          disabled={isLoading}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:bg-blue-300"
        >
          {isLoading ? 'Fetching...' : 'Update Charts'}
        </button>
      </div>


      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          {error}
        </div>
      )}


      {isLoading && !historicalData && (
        <div className="h-96 bg-gray-100 animate-pulse rounded-xl border border-gray-200 flex items-center justify-center">
          <p className="text-gray-400">Processing historical dataset...</p>
        </div>
      )}


      {!isLoading && historicalData && chartData.length > 0 && (
        <div className="mt-8 space-y-8">
          <HistoricalChart 
            data={chartData} 
            title="Average Daily Temperature" 
            dataKey="temperature" 
            color="#ef4444" 
            unit="°C" 
          />
          
          <HistoricalChart 
            data={chartData} 
            title="Daily Precipitation Total" 
            dataKey="precipitation" 
            color="#3b82f6" 
            unit="mm" 
          />
          
          <HistoricalChart 
            data={chartData} 
            title="Maximum Wind Speed" 
            dataKey="windSpeed" 
            color="#10b981" 
            unit="km/h" 
          />
        </div>
      )}
    </div>
  );
}