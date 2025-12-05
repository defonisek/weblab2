import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/home.css';

const HomePage: React.FC = () => {
  return (
    <>
      <header className="header">
        <h1>Добро пожаловать</h1>
        <p>Выберите один из разделов ниже</p>
      </header>
      <main className="main-content">
        <div className="cards-grid">
          <div className="card">
            <div className="card-icon">🌤️</div>
            <h2 className="card-title">Погода</h2>
            <p className="card-description">Текущая погода в любом городе мира</p>
            <Link to="/weather" className="card-link">Перейти</Link>
          </div>
          <div className="card">
            <div className="card-icon">🎭</div>
            <h2 className="card-title">Искусство</h2>
            <p className="card-description">Произведения со всех уголков Европы</p>
            <Link to="/europeana" className="card-link">Перейти</Link>
          </div>
          <div className="card">
            <div className="card-icon">📅</div>
            <h2 className="card-title">Выходной день?</h2>
            <p className="card-description">Проверка, выходной ли день в РФ</p>
            <Link to="/holiday" className="card-link">Перейти</Link>
          </div>
          <div className="card">
            <div className="card-icon">🧠</div>
            <h2 className="card-title">Бесполезные факты</h2>
            <p className="card-description">Случайные факты на EN/DE</p>
            <Link to="/facts" className="card-link">Перейти</Link>
          </div>
        </div>
      </main>
      <footer className="footer">
        <p>&copy; 2025</p>
      </footer>
    </>
  );
};

export default HomePage;
