import React, { useState, useEffect, useRef } from 'react';
import '../styles/pages/facts.css';

interface Fact {
  id: string;
  text: string;
}

const FactsApp: React.FC = () => {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'de'>('en');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const factIdRef = useRef(0);

  const escapeHtml = (str: string): string => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const fetchRandomFact = async () => {
    const url = `https://uselessfacts.jsph.pl/api/v2/facts/random?language=${currentLanguage}`;
    const headers = { 'Accept': 'application/json' };
    setError('');
    setIsLoading(true);
    try {
      const resp = await fetch(url, { headers });
      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }
      const data = await resp.json();
      const text = data?.text || 'Без текста';
      addFactToList(text);
    } catch (e) {
      setError(`Не удалось загрузить факт: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const addFactToList = (text: string) => {
    const newFact: Fact = {
      id: `fact-${factIdRef.current++}`,
      text: text,
    };
    setFacts((prevFacts: Fact[]) => [newFact, ...prevFacts]);
  };

  const handleNewFactClick = () => {
    if (!isLoading) {
      fetchRandomFact();
    }
  };

  const handleLangToggle = () => {
    if (isLoading) return;
    setCurrentLanguage((prev: 'en' | 'de') => (prev === 'en' ? 'de' : 'en'));
  };

  useEffect(() => {
    fetchRandomFact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="facts-wrap">
      <div className="controls">
        <button
          id="new-fact-btn"
          onClick={handleNewFactClick}
          disabled={isLoading}
        >
          {isLoading ? 'Загрузка…' : 'Новый факт'}
        </button>
        <button
          id="lang-toggle-btn"
          onClick={handleLangToggle}
          disabled={isLoading}
          data-lang={currentLanguage}
        >
          Язык: {currentLanguage.toUpperCase()}
        </button>
      </div>
      {error && <div className="error">{error}</div>}
      <ul className="facts-list">
        {facts.map((fact: Fact) => (
          <li key={fact.id} className="fact-item">
            <span className="fact-text">{escapeHtml(fact.text)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FactsApp;
