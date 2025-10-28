document.addEventListener('DOMContentLoaded', function() {
    const weatherForm = document.getElementById('weather-form');
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const weatherResult = document.getElementById('weather-result');
    const errorMessage = document.getElementById('error-message');
    
    // Элементы для отображения данных
    const cityName = document.getElementById('city-name');
    const locationDetails = document.getElementById('location-details');
    const temperature = document.getElementById('temperature');
    const weatherIcon = document.getElementById('weather-icon');
    const weatherDescription = document.getElementById('weather-description');
    const feelsLike = document.getElementById('feels-like');
    const humidity = document.getElementById('humidity');
    const windSpeed = document.getElementById('wind-speed');
    const pressure = document.getElementById('pressure');
    
    // Кнопки популярных городов
    const cityButtons = document.querySelectorAll('.city-btn');

    // Функция для показа/скрытия loading
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

    // Функция для скрытия всех сообщений
    function hideAllMessages() {
        weatherResult.classList.add('hidden');
        errorMessage.classList.add('hidden');
    }

    // Функция для получения координат города
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

    // Функция для получения данных о погоде
    async function getWeatherData(latitude, longitude) {
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`;
        
        try {
            const response = await fetch(weatherUrl);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Ошибка при получении погоды:', error);
            throw error;
        }
    }

    // Функция для преобразования кода погоды в описание и иконку
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

    // Функция для отображения данных о погоде
    function displayWeather(cityInfo, weatherData) {
        const currentWeather = weatherData.current_weather;
        const weatherInfo = getWeatherInfo(currentWeather.weathercode);
        
        // Обновляем элементы DOM
        cityName.textContent = cityInfo.name;
        locationDetails.textContent = `${cityInfo.admin1 ? cityInfo.admin1 + ', ' : ''}${cityInfo.country}`;
        temperature.textContent = `${Math.round(currentWeather.temperature)}°C`;
        weatherIcon.textContent = weatherInfo.icon;
        weatherDescription.textContent = weatherInfo.description;
        feelsLike.textContent = `${Math.round(currentWeather.temperature)}°C`; // В этом API нет feels_like
        humidity.textContent = `${weatherData.hourly?.relativehumidity_2m?.[0] || 'N/A'}%`;
        windSpeed.textContent = `${Math.round(currentWeather.windspeed)} км/ч`;
        pressure.textContent = '1013 hPa'; // В этом API нет давления в бесплатной версии
        
        // Показываем результат
        hideAllMessages();
        weatherResult.classList.remove('hidden');
    }

    // Основная функция для получения и отображения погоды
    async function fetchWeather(city) {
        hideAllMessages();
        setLoading(true);
        
        try {
            // Получаем координаты города
            const cityInfo = await getCityCoordinates(city);
            
            // Получаем данные о погоде
            const weatherData = await getWeatherData(cityInfo.latitude, cityInfo.longitude);
            
            // Отображаем данные
            displayWeather(cityInfo, weatherData);
            
        } catch (error) {
            console.error('Ошибка:', error);
            hideAllMessages();
            errorMessage.classList.remove('hidden');
        } finally {
            setLoading(false);
        }
    }

    // Обработчик отправки формы
    weatherForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const city = cityInput.value.trim();
        
        if (city) {
            fetchWeather(city);
        }
    });

    // Обработчики для кнопок популярных городов
    cityButtons.forEach(button => {
        button.addEventListener('click', function() {
            const city = this.getAttribute('data-city');
            cityInput.value = city;
            fetchWeather(city);
        });
    });

    // Фокусируемся на поле ввода при загрузке страницы
    cityInput.focus();

    console.log('Страница погоды загружена');
});
