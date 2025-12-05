import React from 'react';
import { Link } from 'react-router-dom';
import WeatherApp from '../ts/WeatherApp.tsx';
import '../styles/pages/weather.css';

const WeatherPage: React.FC = () => {
  return (
    <>
      <header className="header">
        <h1>🌤️ Прогноз погоды</h1>
        <p>Узнайте текущую погоду в любом городе мира</p>
        <Link to="/" className="back-link">← На главную</Link>
      </header>
      
      <main className="main-content">
        <WeatherApp />
      </main>
      
      <footer className="footer">
        <p>&copy; 2025 | Данные: Open-Meteo</p>
      </footer>
    </>
  );
};

export default WeatherPage;
