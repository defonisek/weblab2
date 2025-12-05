import React from 'react';
import { Link } from 'react-router-dom';
import FactsApp from '../ts/FactsApp.tsx';
import '../styles/pages/facts.css';

const FactsPage: React.FC = () => {
  return (
    <>
      <header className="header">
        <h1>🧠 Бесполезные факты</h1>
        <p>Случайные факты на EN/DE</p>
        <Link to="/" className="back-link">← На главную</Link>
      </header>
      
      <main className="main-content">
        <FactsApp />
      </main>
      
      <footer className="footer">
        <p>&copy; 2025 | Источник: uselessfacts.jsph.pl</p>
        <p className="secondary-text">ищу переводчика на русский, свободная вакансия</p>
      </footer>
    </>
  );
};

export default FactsPage;
