import React from 'react';
import { Link } from 'react-router-dom';

const HolidayPage: React.FC = () => {
  return (
    <>
      <header className="header">
        <h1>📅 Выходной день?</h1>
        <p>Проверка, выходной ли день в РФ</p>
        <Link to="/" className="back-link">← На главную</Link>
      </header>
      
      <main className="main-content">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Страница в разработке</h2>
          <p>Скоро здесь появится проверка выходных дней</p>
        </div>
      </main>
      
      <footer className="footer">
        <p>&copy; 2025</p>
      </footer>
    </>
  );
};

export default HolidayPage;
