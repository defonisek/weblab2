import React, { useState, useEffect, useCallback } from 'react';
import '../styles/pages/europeana.css';
import { Link } from 'react-router-dom';
// Типы для ответа Europeana API
interface EuropeanaPainting {
  id?: string;
  title?: string[];
  edmPreview?: string[];
  dcDescription?: string[];
  dataProvider?: string[];
  [key: string]: any;
}

interface EuropeanaApiResponse {
  items: EuropeanaPainting[];
  itemsCount?: number;
  totalResults?: number;
  [key: string]: any;
}

interface ApiError {
  message: string;
  status?: number;
}

interface EuropeanaGalleryProps {
  initialLoadDelay?: number;
  apiKey?: string;
  maxPaintings?: number;
}

const EuropeanaGallery: React.FC<EuropeanaGalleryProps> = ({
  initialLoadDelay = 500,
  apiKey = 'atergerpe',
  maxPaintings = 50
}) => {
  // Состояния компонента
  const [paintings, setPaintings] = useState<EuropeanaPainting[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
  const [retryCount, setRetryCount] = useState<number>(0);
  const maxRetries = 3; // Максимальное количество попыток при дубликатах

  // Функция загрузки случайной картины (исправленная)
  const loadRandomPainting = useCallback(async (isRetry = false): Promise<void> => {
    // Если это повторная попытка, увеличиваем счетчик
    if (isRetry) {
      setRetryCount(prev => prev + 1);
      
      // Проверяем, не превышен ли лимит попыток
      if (retryCount >= maxRetries) {
        setError({
          message: 'Не удалось загрузить новую картину после нескольких попыток. Попробуйте еще раз.'
        });
        setLoading(false);
        return;
      }
    } else {
      // Сбрасываем счетчик при новой загрузке
      setRetryCount(0);
    }

    // Проверяем, не превышен ли лимит картин
    if (paintings.length >= maxPaintings) {
      setError({
        message: `Достигнут максимальный лимит картин (${maxPaintings})`
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiUrl: string = `https://api.europeana.eu/record/v2/search.json?wskey=${apiKey}&query=*&qf=TYPE:IMAGE&media=true&theme=art&sort=random&rows=1&profile=rich`;
      
      console.log('Запрос к API:', apiUrl);
      
      const response: Response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Ошибка API: ${response.status} ${response.statusText}`);
      }
      
      const data: EuropeanaApiResponse = await response.json();
      console.log('Получены данные:', data);
      
      if (data.items && data.items.length > 0) {
        const newPainting: EuropeanaPainting = data.items[0];
        
        // Проверяем дубликаты
        const isDuplicate = paintings.some(painting => {
          // Проверяем по ID если он есть
          if (painting.id && newPainting.id) {
            return painting.id === newPainting.id;
          }
          // Иначе проверяем по URL изображения
          if (painting.edmPreview?.[0] && newPainting.edmPreview?.[0]) {
            return painting.edmPreview[0] === newPainting.edmPreview[0];
          }
          return false;
        });
        
        if (!isDuplicate) {
          setPaintings(prev => [newPainting, ...prev]);
          setRetryCount(0); // Сбрасываем счетчик при успешной загрузке
        } else {
          console.log('Найден дубликат. Попытка', retryCount + 1);
          
          // Вместо рекурсии показываем сообщение
          setError({
            message: 'Найдена дубликат картины. Нажмите "Загрузить еще раз" для новой попытки.'
          });
          
          // Автоматически пробуем снова через 1 секунду, но не более maxRetries раз
          if (retryCount < maxRetries - 1) {
            setTimeout(() => {
              loadRandomPainting(true);
            }, 1000);
          }
        }
      } else {
        setError({
          message: 'Не удалось найти картины. Попробуйте еще раз.'
        });
      }
      
    } catch (err: unknown) {
      console.error('Ошибка загрузки картины:', err);
      
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Неизвестная ошибка';
        
      setError({
        message: `Произошла ошибка: ${errorMessage}`
      });
    } finally {
      // Не сбрасываем loading сразу, если это рекурсивный вызов
      if (!isRetry || retryCount >= maxRetries) {
        setLoading(false);
        setLoadingInitial(false);
      }
    }
  }, [apiKey, paintings.length, maxPaintings, retryCount, maxRetries]);

  // Упрощенная версия без рекурсии (альтернативный вариант)
  const loadRandomPaintingSimple = useCallback(async (): Promise<void> => {
    // Проверяем, не превышен ли лимит картин
    if (paintings.length >= maxPaintings) {
      setError({
        message: `Достигнут максимальный лимит картин (${maxPaintings})`
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiUrl: string = `https://api.europeana.eu/record/v2/search.json?wskey=${apiKey}&query=*&qf=TYPE:IMAGE&media=true&theme=art&sort=random&rows=1&profile=rich`;
      
      const response: Response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Ошибка API: ${response.status} ${response.statusText}`);
      }
      
      const data: EuropeanaApiResponse = await response.json();
      
      if (data.items && data.items.length > 0) {
        const newPainting: EuropeanaPainting = data.items[0];
        
        // Упрощенная проверка дубликатов (без рекурсии)
        const isDuplicate = paintings.some(painting => 
          (painting.id && newPainting.id && painting.id === newPainting.id) ||
          (painting.edmPreview?.[0] && newPainting.edmPreview?.[0] && 
           painting.edmPreview[0] === newPainting.edmPreview[0])
        );
        
        if (!isDuplicate) {
          setPaintings(prev => [newPainting, ...prev]);
        } else {
          // Просто показываем сообщение без рекурсивного вызова
          setError({
            message: 'Загружена дубликат картина. Нажмите "Получить случайную картину" еще раз.'
          });
        }
      } else {
        setError({
          message: 'Не удалось найти картины. Попробуйте еще раз.'
        });
      }
      
    } catch (err: unknown) {
      console.error('Ошибка загрузки картины:', err);
      
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Неизвестная ошибка';
        
      setError({
        message: `Произошла ошибка: ${errorMessage}`
      });
    } finally {
      setLoading(false);
      setLoadingInitial(false);
    }
  }, [apiKey, paintings, maxPaintings]);

  // Функция очистки галереи
  const clearGallery = (): void => {
    setPaintings([]);
    setError(null);
    setRetryCount(0);
  };

  // Функция удаления конкретной картины
  const removePainting = (index: number): void => {
    setPaintings(prev => prev.filter((_, i) => i !== index));
  };

  // Загружаем первую картину при монтировании компонента
  useEffect(() => {
    const timer = setTimeout(() => {
      // Используем упрощенную версию для начальной загрузки
      loadRandomPaintingSimple();
    }, initialLoadDelay);

    return () => clearTimeout(timer);
  }, [initialLoadDelay]); // Убрали loadRandomPaintingSimple из зависимостей

  // Компонент для отображения одной картины
  const PaintingCard: React.FC<{ 
    painting: EuropeanaPainting; 
    index: number;
    onRemove: (index: number) => void;
  }> = ({ painting, index, onRemove }) => {
    const [imageError, setImageError] = useState<boolean>(false);

    return (
      <div className="painting-container">
        <button 
          className="remove-button"
          onClick={() => onRemove(index)}
          title="Удалить картину"
          aria-label="Удалить картину"
        >
          ✕
        </button>
        
        {painting.edmPreview && painting.edmPreview[0] && !imageError ? (
          <img 
            src={painting.edmPreview[0]} 
            alt={painting.title?.[0] || 'Картина из коллекции Europeana'} 
            className="painting-image"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="image-placeholder">
            <span>🖼️</span>
            <p>Изображение недоступно</p>
          </div>
        )}
        
        {painting.title && painting.title[0] && (
          <div className="painting-title" title={painting.title[0]}>
            {painting.title[0]}
          </div>
        )}
        
        {painting.dcDescription && painting.dcDescription[0] && (
          <div className="painting-description">
            {painting.dcDescription[0].length > 200 
              ? `${painting.dcDescription[0].substring(0, 200)}...` 
              : painting.dcDescription[0]}
          </div>
        )}
        
        {painting.dataProvider && painting.dataProvider[0] && (
          <div className="painting-source">
            <strong>Источник:</strong> {painting.dataProvider[0]}
          </div>
        )}
        
        {painting.id && (
          <div className="painting-id">
            <small>ID: {painting.id}</small>
          </div>
        )}
        
        <hr className="separator" />
      </div>
    );
  };

  return (
    <div className="europeana-gallery" role="main">
      <header className="header">
        <h1>🎨 Галерея случайных картин из Europeana</h1>
        <Link to="/" className="back-link">← На главную</Link>
      </header>

      <div className="container">
        
        {/* Статистика */}
        {paintings.length > 0 && (
          <div className="gallery-stats">
            <div className="stat-item">
              <span className="stat-caution">Лимит 50 изображений. Рекомендуется использование VPN.</span>
              <span className="stat-label">Всего картин:</span>
              <span className="stat-value">{paintings.length}</span>
            </div>
           
          </div>
        )}

        <div className="button-container">
          <button 
            id="loadButton" 
            onClick={() => loadRandomPaintingSimple()} // Используем упрощенную версию
            disabled={loading || paintings.length >= maxPaintings}
            aria-busy={loading}
            aria-label="Загрузить случайную картину"
          >
            {loading ? (
              <>
                <span className="spinner" aria-hidden="true"></span>
                Загрузка...
              </>
            ) : paintings.length >= maxPaintings ? (
              'Лимит достигнут'
            ) : (
              '🔄 Получить случайную картину'
            )}
          </button>
          
          <button 
            id="clearButton" 
            onClick={clearGallery}
            disabled={paintings.length === 0}
            aria-label="Очистить галерею"
          >
            ❌ Очистить галерею
          </button>
        </div>

        {loadingInitial ? (
          <div className="loading" role="status" aria-live="polite">
            <div className="loading-spinner"></div>
            <p>Загрузка первой картины...</p>
          </div>
        ) : (
          <>
            {loading && (
              <div className="loading" role="status" aria-live="polite">
                <div className="loading-spinner"></div>
                <p>Загрузка случайной картины...</p>
              </div>
            )}

            {error && (
              <div 
                className="error" 
                role="alert"
                aria-live="assertive"
              >
                <p>{error.message}</p>
                {paintings.length < maxPaintings && !loading && (
                  <button 
                    className="retry-button"
                    onClick={() => loadRandomPaintingSimple()}
                    aria-label="Попробовать снова"
                  >
                    Попробовать снова
                  </button>
                )}
              </div>
            )}

            <div 
              id="paintingGallery" 
              className={`painting-gallery ${paintings.length === 0 ? 'empty' : ''}`}
              aria-live="polite"
              aria-label="Галерея картин"
            >
              {paintings.length === 0 && !loading && !error && (
                <div className="no-paintings">
                  <div className="empty-state-icon">🖼️</div>
                  <h3>Галерея пуста</h3>
                  <p>Нажмите кнопку "Получить случайную картину", чтобы начать</p>
                </div>
              )}
              
              {paintings.map((painting, index) => (
                <PaintingCard 
                  key={`${painting.id || 'painting'}-${index}`}
                  painting={painting}
                  index={index}
                  onRemove={removePainting}
                />
              ))}
            </div>

            {paintings.length > 0 && paintings.length >= maxPaintings && (
              <div className="limit-message" role="alert">
                <p>⚠️ Достигнут максимальный лимит картин ({maxPaintings})</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EuropeanaGallery;