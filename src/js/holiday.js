function formatDateForAPI(dateObj) {
    const year = dateObj.getFullYear().toString().padStart(4, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');

    return `${year}${month}${day}`;
}

const dateInput = document.getElementById('dateInput');
const checkHolidayBtn = document.getElementById('checkHolidayBtn');
const resultSection = document.getElementById('resultSection');

const today = new Date();
dateInput.valueAsDate = today;
checkHolidayBtn.addEventListener('click', async () => {
    const selectedDate = dateInput.valueAsDate;
    if (!selectedDate) {
        resultSection.innerHTML = '<p class="error">Пожалуйста, выберите дату.</p>';
        return;
    }

    const dateStr = formatDateForAPI(selectedDate);
    const apiUrl = `https://isdayoff.ru/${dateStr}?cc=ru&pre=1`;

    try {
        resultSection.innerHTML = '<p>Загрузка...</p>';

        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();

        let message = '';
        let className = 'result';

        switch (data) {
            case '0':
                message = `День ${selectedDate.toLocaleDateString('ru-RU')} является <strong>рабочим</strong>.`;
                className += ' work-day';
                break;
            case '1':
                message = `День ${selectedDate.toLocaleDateString('ru-RU')} является <strong>нерабочим</strong> (выходной).`;
                className += ' off-day';
                break;
            case '2':
                message = `День ${selectedDate.toLocaleDateString('ru-RU')} является <strong>предпраздничным</strong> (сокращённый рабочий день).`;
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
        resultSection.innerHTML = `<p class="${className}">${message}</p>`;

    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        resultSection.innerHTML = `<p class="error">Произошла ошибка при запросе к API: ${error.message}</p>`;
    }
});
