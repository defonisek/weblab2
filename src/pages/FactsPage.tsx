import React from 'react';
import { Link } from 'react-router-dom';

const FactsPage: React.FC = () => {
  return (
    <>
      <header className="header">
        <h1>🧠 Бесполезные факты</h1>
        <p>Случайные факты на EN/DE</p>
        <Link to="/" className="back-link">← На главную</Link>
      </header>
      
      <main className="main-content">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Страница в разработке</h2>
          <p>Скоро здесь появятся бесполезные факты</p>
        </div>
      </main>
      
      <footer className="footer">
        <p>&copy; 2025</p>
      </footer>
    </>
  );
};

export default FactsPage;
