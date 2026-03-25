
const BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const AQI_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const ARCHIVE_URL = 'https://archive-api.open-meteo.com/v1/archive';

export const fetchCurrentAndHourlyData = async (lat, lon) => {
  try {
    const weatherParams = new URLSearchParams({
      latitude: lat,
      longitude: lon,
      current: 'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m',
      hourly: 'temperature_2m,relative_humidity_2m,precipitation,visibility,wind_speed_10m',
      daily: 'temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max',
      timezone: 'Asia/Kolkata',
    });

    const aqiParams = new URLSearchParams({
      latitude: lat,
      longitude: lon,
      current: 'european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide',
      hourly: 'pm10,pm2_5',
      timezone: 'Asia/Kolkata',
    });

    const [weatherRes, aqiRes] = await Promise.all([
      fetch(`${BASE_URL}?${weatherParams.toString()}`),
      fetch(`${AQI_URL}?${aqiParams.toString()}`)
    ]);

    if (!weatherRes.ok || !aqiRes.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const weatherData = await weatherRes.json();
    const aqiData = await aqiRes.json();

    return {
      current: { ...weatherData.current, ...weatherData.daily, ...aqiData.current },
      hourly: { ...weatherData.hourly, ...aqiData.hourly },
    };

  } catch (error) {
    console.error('Error in weatherService:', error);
    throw error;
  }
};


export const fetchHistoricalData = async (lat, lon, startDate, endDate) => {
  try {
    const weatherParams = new URLSearchParams({
      latitude: lat,
      longitude: lon,
      start_date: startDate, 
      end_date: endDate,
      daily: 'temperature_2m_max,temperature_2m_min,temperature_2m_mean,sunrise,sunset,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant',
      timezone: 'Asia/Kolkata',
    });

    const weatherRes = await fetch(`${ARCHIVE_URL}?${weatherParams.toString()}`);

    if (!weatherRes.ok) {
      throw new Error('Failed to fetch historical data');
    }

    const weatherData = await weatherRes.json();

    return {
      dailyWeather: weatherData.daily,
    };

  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
};