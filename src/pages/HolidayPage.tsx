import React from 'react';
import { Link } from 'react-router-dom';
import HolidayChecker from '../ts/HolidayChecker.tsx';
import '../styles/pages/holiday.css';

const HolidayPage: React.FC = () => {
  return (
    <>
      <header className="header">
        <h1>Проверка выходного дня</h1>
        <p>Узнайте, является ли день рабочим или выходным</p>
        <Link to="/" className="back-link">← На главную</Link>
      </header>
      
      <main className="main-content">
        <HolidayChecker />
      </main>
      
      <footer className="footer">
        <p>&copy; 2025</p>
        <p><a href="https://isdayoff.ru/" target="_blank" rel="noopener noreferrer">Данные предоставлены сервисом isdayoff.ru</a></p>
      </footer>
    </>
  );
};

export default HolidayPage;