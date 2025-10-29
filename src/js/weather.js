document.addEventListener('DOMContentLoaded', function() {
    const weatherForm = document.getElementById('weather-form');
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const weatherResult = document.getElementById('weather-result');
    const errorMessage = document.getElementById('error-message');
    
    const cityName = document.getElementById('city-name');
    const locationDetails = document.getElementById('location-details');
    const temperature = document.getElementById('temperature');
    const weatherIcon = document.getElementById('weather-icon');
    const weatherDescription = document.getElementById('weather-description');
    const feelsLike = document.getElementById('feels-like');
    const humidity = document.getElementById('humidity');
    const windSpeed = document.getElementById('wind-speed');
    const pressure = document.getElementById('pressure');
    const cityButtons = document.querySelectorAll('.city-btn');

    function setLoading(isLoading) {
        if (isLoading) {
            searchBtn.disabled = true;
            loadingSpinner.classList.add('active');
            searchBtn.querySelector('span').style.visibility = 'hidden';
        } else {
            searchBtn.disabled = false;
            loadingSpinner.classList.remove('active');
            searchBtn.querySelector('span').style.visibility = 'visible';
        }
    }
    function hideAllMessages() {
        weatherResult.classList.add('hidden');
        errorMessage.classList.add('hidden');
    }
    async function getCityCoordinates(cityName) {
        const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=ru&format=json`;
        try {
            const response = await fetch(geocodingUrl);
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                const city = data.results[0];
                return {
                    latitude: city.latitude,
                    longitude: city.longitude,
                    name: city.name,
                    country: city.country,
                    admin1: city.admin1 // регион/область
                };
            } else {
                throw new Error('Город не найден');
            }
        } catch (error) {
            console.error('Ошибка при получении координат:', error);
            throw error;
        }
    }
    async function getWeatherData(latitude, longitude) {
		const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,wind_direction_10m&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto&forecast_days=1`;;
        try {
            const response = await fetch(weatherUrl);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Ошибка при получении погоды:', error);
            throw error;
        }
    }
    function getWeatherInfo(weatherCode) {
        const weatherCodes = {
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
    }
    function displayWeather(cityInfo, weatherData) {
        const currentWeather = weatherData.current_weather;
		const currentHour = new Date().getHours();
        const weatherInfo = getWeatherInfo(currentWeather.weathercode);
        cityName.textContent = cityInfo.name;
        locationDetails.textContent = `${cityInfo.admin1 ? cityInfo.admin1 + ', ' : ''}${cityInfo.country}`;
        temperature.textContent = `${Math.round(currentWeather.temperature)}°C`;
        weatherIcon.textContent = weatherInfo.icon;
        weatherDescription.textContent = weatherInfo.description;
        feelsLike.textContent = `${Math.round(weatherData.hourly.apparent_temperature[currentHour])}°C`;
        humidity.textContent = `${weatherData.hourly.relative_humidity_2m[currentHour] || 'N/A'}%`;
        windSpeed.textContent = `${Math.round(currentWeather.windspeed)} км/ч`;
        hideAllMessages();
        weatherResult.classList.remove('hidden');
    }
    async function fetchWeather(city) {
        hideAllMessages();
        setLoading(true);
        try {
            const cityInfo = await getCityCoordinates(city);
            const weatherData = await getWeatherData(cityInfo.latitude, cityInfo.longitude);
            displayWeather(cityInfo, weatherData);
        } catch (error) {
            console.error('Ошибка:', error);
            hideAllMessages();
            errorMessage.classList.remove('hidden');
        } finally {
            setLoading(false);
        }
    }
    weatherForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const city = cityInput.value.trim();
        if (city) {
            fetchWeather(city);
        }
    });
    cityButtons.forEach(button => {
        button.addEventListener('click', function() {
            const city = this.getAttribute('data-city');
            cityInput.value = city;
            fetchWeather(city);
        });
    });
    cityInput.focus();
});
