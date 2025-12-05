import React, { useState, useEffect, FormEvent } from 'react';
import '../styles/pages/weather.css';

interface CityCoordinates {
  latitude: number;
  longitude: number;
  name: string;
  country: string;
  admin1?: string;
}

interface WeatherData {
  current_weather: {
    temperature: number;
    weathercode: number;
    windspeed: number;
  };
  hourly: {
    apparent_temperature: number[];
    relative_humidity_2m: number[];
  };
}

interface WeatherInfo {
  description: string;
  icon: string;
}

const WeatherApp: React.FC = () => {
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [cityInfo, setCityInfo] = useState<CityCoordinates | null>(null);
  const [error, setError] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [showError, setShowError] = useState(false);

  const getWeatherInfo = (weatherCode: number): WeatherInfo => {
    const weatherCodes: Record<number, WeatherInfo> = {
      0: { description: 'Ясно', icon: '☀️' },
      1: { description: 'Преимущественно ясно', icon: '🌤️' },
      2: { description: 'Переменная облачность', icon: '⛅' },
      3: { description: 'Пасмурно', icon: '☁️' },
      45: { description: 'Туман', icon: '🌫️' },
      48: { description: 'Изморозь', icon: '🌫️' },
      51: { description: 'Леняя морось', icon: '🌧️' },
      53: { description: 'Умеренная морось', icon: '🌧️' },
      55: { description: 'Сильная морось', icon: '🌧️' },
      61: { description: 'Небольшой дождь', icon: '🌧️' },
      63: { description: 'Умеренный дождь', icon: '🌧️' },
      65: { description: 'Сильный дождь', icon: '🌧️' },
      80: { description: 'Ливень', icon: '⛈️' },
      81: { description: 'Сильный ливень', icon: '⛈️' },
      82: { description: 'Очень сильный ливень', icon: '⛈️' },
      95: { description: 'Гроза', icon: '⛈️' },
      96: { description: 'Гроза с градом', icon: '⛈️' }
    };
    
    return weatherCodes[weatherCode] || { description: 'Неизвестно', icon: '❓' };
  };

  const getCityCoordinates = async (cityName: string): Promise<CityCoordinates> => {
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=ru&format=json`;
    
    const response = await fetch(geocodingUrl);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const city = data.results[0];
      return {
        latitude: city.latitude,
        longitude: city.longitude,
        name: city.name,
        country: city.country,
        admin1: city.admin1
      };
    } else {
      throw new Error('Город не найден');
    }
  };

  const getWeather = async (latitude: number, longitude: number): Promise<WeatherData> => {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,wind_direction_10m&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto&forecast_days=1`;
    
    const response = await fetch(weatherUrl);
    return await response.json();
  };

  const fetchWeather = async (cityName: string) => {
    if (!cityName.trim()) return;
    
    setIsLoading(true);
    setError('');
    setShowError(false);
    setShowResult(false);
    
    try {
      const coordinates = await getCityCoordinates(cityName);
      const weather = await getWeather(coordinates.latitude, coordinates.longitude);
      
      setCityInfo(coordinates);
      setWeatherData(weather);
      setShowResult(true);
    } catch (err) {
      setError('Не удалось найти город. Проверьте название и попробуйте снова.');
      setShowError(true);
      setWeatherData(null);
      setCityInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetchWeather(city);
  };

  const handleCityClick = (cityName: string) => {
    setCity(cityName);
    fetchWeather(cityName);
  };

  const popularCities = ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Лондон', 'Нью-Йорк'];

  return (
    <div className="weather-container">
      <div className="search-section">
        <form id="weather-form" className="weather-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              id="city-input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Введите название города..."
              required
            />
            <button type="submit" id="search-btn" disabled={isLoading}>
              <span>Поиск</span>
              <div className={`loading-spinner ${isLoading ? 'active' : ''}`} id="loading-spinner"></div>
            </button>
          </div>
        </form>
      </div>

      {showError && (
        <div id="error-message" className="error-message">
          <p>❌ {error}</p>
        </div>
      )}

      {showResult && weatherData && cityInfo && (
        <div id="weather-result" className="weather-result">
          <div className="weather-card">
            <div className="location">
              <h2 id="city-name">{cityInfo.name}</h2>
              <p id="location-details">
                {`${cityInfo.admin1 ? cityInfo.admin1 + ', ' : ''}${cityInfo.country}`}
              </p>
            </div>
            <div className="weather-main">
              <div className="temperature">
                <span id="temperature">{`${Math.round(weatherData.current_weather.temperature)}°C`}</span>
                <div className="weather-icon" id="weather-icon">
                  {getWeatherInfo(weatherData.current_weather.weathercode).icon}
                </div>
              </div>
              <p className="weather-description" id="weather-description">
                {getWeatherInfo(weatherData.current_weather.weathercode).description}
              </p>
            </div>
            <div className="weather-details">
              <div className="detail-item">
                <span className="detail-label">Ощущается как</span>
                <span className="detail-value" id="feels-like">
                  {`${Math.round(weatherData.hourly.apparent_temperature[new Date().getHours()])}°C`}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Влажность</span>
                <span className="detail-value" id="humidity">
                  {`${weatherData.hourly.relative_humidity_2m[new Date().getHours()] || 'N/A'}%`}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Ветер</span>
                <span className="detail-value" id="wind-speed">
                  {`${Math.round(weatherData.current_weather.windspeed)} км/ч`}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="recent-cities">
        <h3>Популярные города:</h3>
        <div className="cities-list">
          {popularCities.map((cityName) => (
            <button
              key={cityName}
              className="city-btn"
              onClick={() => handleCityClick(cityName)}
              data-city={cityName}
            >
              {cityName}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
