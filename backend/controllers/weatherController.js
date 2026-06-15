const asyncHandler = require('express-async-handler');
const axios = require('axios');

const STATE_COORDS = {
  'Madhya Pradesh': { lat: 23.2599, lon: 77.4126, city: 'Bhopal' },
  'Uttar Pradesh': { lat: 26.8467, lon: 80.9462, city: 'Lucknow' },
  'Maharashtra': { lat: 19.0760, lon: 72.8777, city: 'Mumbai' },
  'Punjab': { lat: 30.7333, lon: 76.7794, city: 'Chandigarh' },
  'Haryana': { lat: 30.7333, lon: 76.7794, city: 'Chandigarh' },
  'Gujarat': { lat: 23.2156, lon: 72.6369, city: 'Gandhinagar' },
  'Rajasthan': { lat: 26.9124, lon: 75.7873, city: 'Jaipur' },
  'Karnataka': { lat: 12.9716, lon: 77.5946, city: 'Bangalore' },
  'Andhra Pradesh': { lat: 15.9129, lon: 79.7400, city: 'Amaravati' },
  'Tamil Nadu': { lat: 13.0827, lon: 80.2707, city: 'Chennai' },
  'Bihar': { lat: 25.5941, lon: 85.1376, city: 'Patna' },
  'West Bengal': { lat: 22.5726, lon: 88.3639, city: 'Kolkata' },
};

const WMO_CODES = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Icy fog', 51: 'Light drizzle', 53: 'Moderate drizzle',
  61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
  71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
  80: 'Rain showers', 81: 'Moderate showers', 82: 'Violent showers',
  95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm heavy hail',
};

const getWeatherEmoji = (code) => {
  if (code === 0 || code === 1) return '☀️';
  if (code === 2 || code === 3) return '⛅';
  if (code >= 45 && code <= 48) return '🌫️';
  if (code >= 51 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 82) return '🌦️';
  if (code >= 95) return '⛈️';
  return '🌤️';
};


const getWeather = asyncHandler(async (req, res) => {
  let { lat, lon, state } = req.query;

  
  if (!lat || !lon) {
    const coords = STATE_COORDS[state] || STATE_COORDS['Madhya Pradesh'];
    lat = coords.lat;
    lon = coords.lon;
  }

  try {
    const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,precipitation',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max',
        timezone: 'Asia/Kolkata',
        forecast_days: 7,
      },
      timeout: 8000,
    });

    const cur = data.current;
    const daily = data.daily;

    res.json({
      current: {
        temp: Math.round(cur.temperature_2m),
        humidity: cur.relative_humidity_2m,
        windSpeed: Math.round(cur.wind_speed_10m),
        weatherCode: cur.weather_code,
        condition: WMO_CODES[cur.weather_code] || 'Unknown',
        emoji: getWeatherEmoji(cur.weather_code),
        precipitation: cur.precipitation,
      },
      forecast: daily.time.map((date, i) => ({
        date,
        maxTemp: Math.round(daily.temperature_2m_max[i]),
        minTemp: Math.round(daily.temperature_2m_min[i]),
        precipitation: daily.precipitation_sum[i],
        windSpeed: Math.round(daily.wind_speed_10m_max[i]),
        condition: WMO_CODES[daily.weather_code[i]] || 'Unknown',
        emoji: getWeatherEmoji(daily.weather_code[i]),
      })),
      
      advisory: generateFarmAdvisory(cur.weather_code, cur.temperature_2m, daily.precipitation_sum),
    });
  } catch (err) {
    res.status(503).json({ message: 'Weather service temporarily unavailable', error: err.message });
  }
});

const generateFarmAdvisory = (code, temp, precipForecast) => {
  const advisories = [];
  if (code >= 61 && code <= 67) advisories.push('🌧️ Rain expected — avoid pesticide/fertilizer application today');
  if (code >= 80) advisories.push('⛈️ Heavy rain forecast — secure stored produce and check drainage');
  if (temp > 40) advisories.push('🌡️ High temperature alert — irrigate crops in early morning or evening');
  if (temp < 5) advisories.push('❄️ Cold wave alert — protect sensitive crops with mulching');
  if (precipForecast?.[0] > 10) advisories.push('💧 Heavy rainfall in next 24h — postpone any field operations');
  if (precipForecast?.slice(0,7).every(p => p < 1)) advisories.push('🏜️ Dry week ahead — ensure adequate irrigation for standing crops');
  if (advisories.length === 0) advisories.push('✅ Weather conditions are favorable for normal farm operations');
  return advisories;
};

module.exports = { getWeather };
