const API_BASE_URL = 'http://37.157.198.11:9000/api/v0';

async function getCalendarDataForDate(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    const url = `${API_BASE_URL}/en/calendars/default/${year}/${month}/${day}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
}

document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date-input');
    const fetchBtn = document.getElementById('fetch-btn');
    const calendarInfoDiv = document.getElementById('calendar-info');

    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    function displayDayInfo(dayData) {
        if (!dayData || !dayData.celebrations || dayData.celebrations.length === 0) {
            calendarInfoDiv.innerHTML = '<div class="error">Информация о праздниках на этот день отсутствует.</div>';
            return;
        }

        let html = `
            <div class="day-info">
                <div class="date">${dayData.date}</div>
                <div class="season">${formatSeason(dayData.season)} (Неделя ${dayData.season_week})</div>
                <div class="celebrations">
        `;

        dayData.celebrations.forEach(celebration => {
            const colorClass = `color-${celebration.colour}`;
            html += `
                <div class="celebration-item ${colorClass}">
                    <div class="celebration-title">${celebration.title}</div>
                    <div class="celebration-rank">${celebration.rank}</div>
                </div>
            `;
        });

        html += `
                </div> <!-- .celebrations -->
            </div> <!-- .day-info -->
        `;

        calendarInfoDiv.innerHTML = html;
    }

    function formatSeason(season) {
        const seasonNames = {
            'advent': 'Адвент',
            'christmas': 'Рождество',
            'lent': 'Великий пост',
            'easter': 'Пасха',
            'ordinary': 'Обычное время'
        };
        return seasonNames[season] || season;
    }

    fetchBtn.addEventListener('click', async () => {
        const selectedDate = dateInput.value;
        if (!selectedDate) {
            calendarInfoDiv.innerHTML = '<div class="error">Выберите дату.</div>';
            return;
        }

        try {
            calendarInfoDiv.innerHTML = '<div>Загрузка...</div>';
            const data = await getCalendarDataForDate(selectedDate);
            displayDayInfo(data);
        } catch (error) {
            calendarInfoDiv.innerHTML = `<div class="error">Ошибка: ${error.message || 'Не удалось загрузить данные'}</div>`;
        }
    });
    fetchBtn.click();
});