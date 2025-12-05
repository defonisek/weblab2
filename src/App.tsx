import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WeatherPage from './pages/WeatherPage';
import EuropeanaPage from './pages/EuropeanaPage';
import HolidayPage from './pages/HolidayPage';
import FactsPage from './pages/FactsPage';
import './styles/main.css';

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/europeana" element={<EuropeanaPage />} />
        <Route path="/holiday" element={<HolidayPage />} />
        <Route path="/facts" element={<FactsPage />} />
      </Routes>
    </div>
  );
}

export default App;
