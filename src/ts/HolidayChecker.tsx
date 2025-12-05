import React, { useState, useEffect, FormEvent } from 'react';

interface HolidayResult {
  message: string;
  className: string;
}

const HolidayChecker: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<HolidayResult | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    setSelectedDate(formattedToday);
  }, []);

  const formatDateForAPI = (dateString: string): string => {
    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear().toString().padStart(4, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
  };

  const checkHoliday = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) {
      setResult({
        message: 'Пожалуйста, выберите дату.',
        className: 'error'
      });
      return;
    }

    const dateStr = formatDateForAPI(selectedDate);
    const apiUrl = `https://isdayoff.ru/${dateStr}?cc=ru&pre=1`;

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.text();

      const dateObj = new Date(selectedDate);
      const formattedDate = dateObj.toLocaleDateString('ru-RU');
      let message = '';
      let className = 'result';

      switch (data) {
        case '0':
          message = `День ${formattedDate} является <strong>рабочим</strong>.`;
          className += ' work-day';
          break;
        case '1':
          message = `День ${formattedDate} является <strong>нерабочим</strong> (выходной).`;
          className += ' off-day';
          break;
        case '2':
          message = `День ${formattedDate} является <strong>предпраздничным</strong> (сокращённый рабочий день).`;
          className += ' pre-holiday';
          break;
        case '100':
          message = 'Ошибка в формате даты.';
          className += ' error';
          break;
        case '101':
          message = 'Данные для указанной даты не найдены.';
          className += ' error';
          break;
        default:
          message = `Неизвестный статус: ${data}`;
          className += ' error';
      }

      setResult({ message, className });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      console.error('Ошибка при получении данных:', err);
      setError(`Произошла ошибка при запросе к API: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="holiday-checker">
      <div className="input-section">
        <form onSubmit={checkHoliday}>
          <label htmlFor="dateInput">Выберите дату:</label>
          <input
            type="date"
            id="dateInput"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            required
          />
          <button 
            id="checkHolidayBtn" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Загрузка...' : 'Проверить'}
          </button>
        </form>
      </div>
      
      <div id="resultSection" className="result-section">
        {isLoading && <p>Загрузка...</p>}
        
        {error && (
          <p className="error">
            {error}
          </p>
        )}
        
        {result && !isLoading && (
          <p 
            className={result.className}
            dangerouslySetInnerHTML={{ __html: result.message }}
          />
        )}
      </div>
    </div>
  );
};

export default HolidayChecker;