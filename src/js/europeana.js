// Ваш API-ключ Europeana
const API_KEY = 'atergerpe'; // Замените на ваш настоящий ключ

// Основная функция для загрузки случайной картины
async function loadRandomPainting() {
    // Показываем индикатор загрузки
    showLoading(true);
    hideError();

    try {
        const apiUrl = `https://api.europeana.eu/record/v2/search.json?wskey=${API_KEY}&query=*&qf=TYPE:IMAGE&media=true&theme=art&sort=random&rows=1&profile=rich`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`Ошибка API: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            displayPainting(data.items[0]);
        } else {
            showError('Не удалось найти картины');
        }
        
    } catch (error) {
        console.error('Ошибка:', error);
        showError(`Произошла ошибка: ${error.message}`);
    } finally {
        showLoading(false);
    }
}

// Функция для отображения картины на странице
function displayPainting(painting) {
    const gallery = document.getElementById('paintingGallery');
    
    const paintingElement = document.createElement('div');
    paintingElement.className = 'painting-container';
    
    // Формируем HTML для картины
    let paintingHTML = '';
    
    // Изображение
    if (painting.edmPreview && painting.edmPreview[0]) {
        paintingHTML += `<img src="${painting.edmPreview[0]}" alt="${painting.title ? painting.title[0] : 'Картина'}" id="paintingImage">`;
    } else {
        paintingHTML += '<p>Изображение недоступно</p>';
    }
    
    // Название
    if (painting.title && painting.title[0]) {
        paintingHTML += `<div class="painting-title">${painting.title[0]}</div>`;
    }
    
    // Описание
    if (painting.dcDescription && painting.dcDescription[0]) {
        paintingHTML += `<div class="painting-description">${painting.dcDescription[0]}</div>`;
    }
    
    // Источник
    if (painting.dataProvider && painting.dataProvider[0]) {
        paintingHTML += `<div class="painting-source">Источник: ${painting.dataProvider[0]}</div>`;
    }
    
    // Разделитель
    paintingHTML += '<hr class="separator">';
    
    paintingElement.innerHTML = paintingHTML;
    
    // Добавляем новую картину в начало галереи
    gallery.insertBefore(paintingElement, gallery.firstChild);
}

// Функция для очистки галереи
function clearGallery() {
    document.getElementById('paintingGallery').innerHTML = '';
}

// Вспомогательные функции для управления UI
function showLoading(show) {
    document.getElementById('loadingMessage').style.display = show ? 'block' : 'none';
    document.getElementById('loadButton').disabled = show;
}

function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function hideError() {
    document.getElementById('errorMessage').style.display = 'none';
}

// Автоматически загружаем первую картину при загрузке страницы
window.addEventListener('load', function() {
    // Небольшая задержка для лучшего UX
    setTimeout(loadRandomPainting, 500);
});