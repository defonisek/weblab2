import React from 'react';
import { Link } from 'react-router-dom';

const EuropeanaPage: React.FC = () => {
  return (
    <>
      <header className="header">
        <h1>🎭 Искусство</h1>
        <p>Произведения со всех уголков Европы</p>
        <Link to="/" className="back-link">← На главную</Link>
      </header>
      
      <main className="main-content">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Страница в разработке</h2>
          <p>Скоро здесь появятся произведения искусства</p>
        </div>
      </main>
      
      <footer className="footer">
        <p>&copy; 2025</p>
      </footer>
    </>
  );
};

export default EuropeanaPage;
