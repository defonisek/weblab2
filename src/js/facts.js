document.addEventListener('DOMContentLoaded', () => {
    const factsList = document.getElementById('facts-list');
    const newFactBtn = document.getElementById('new-fact-btn');
    const langToggleBtn = document.getElementById('lang-toggle-btn');
    const errorEl = document.getElementById('error');

    let currentLanguage = 'en';
    let isLoading = false;

    function setError(message) {
        if (!message) {
            errorEl.textContent = '';
            errorEl.classList.add('hidden');
            return;
        }
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
    }

    function setLoading(loading) {
        isLoading = loading;
        newFactBtn.disabled = loading;
        langToggleBtn.disabled = loading;
        newFactBtn.textContent = loading ? 'Загрузка…' : 'Новый факт';
    }

    function updateLangButton() {
        langToggleBtn.dataset.lang = currentLanguage;
        langToggleBtn.textContent = `Язык: ${currentLanguage.toUpperCase()}`;
    }

    // Перевод больше не используется; поддерживаем только en/de

    async function fetchRandomFact() {
        const url = `https://uselessfacts.jsph.pl/api/v2/facts/random?language=${currentLanguage}`;
        const headers = { 'Accept': 'application/json' };
        setError('');
        setLoading(true);
        try {
            const resp = await fetch(url, { headers });
            if (!resp.ok) {
                throw new Error(`HTTP ${resp.status}`);
            }
            const data = await resp.json();
            const text = data?.text || 'Без текста';
            addFactToList(text);
        } catch (e) {
            setError(`Не удалось загрузить факт: ${e.message}`);
        } finally {
            setLoading(false);
        }
    }

    function addFactToList(text) {
        const li = document.createElement('li');
        li.className = 'fact-item';
        li.innerHTML = `<span class="fact-text">${escapeHtml(text)}</span>`;
        factsList.insertBefore(li, factsList.firstChild);
    }

    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    newFactBtn.addEventListener('click', () => {
        if (!isLoading) fetchRandomFact();
    });

    langToggleBtn.addEventListener('click', () => {
        if (isLoading) return;
        // Переключение EN ↔ DE
        currentLanguage = currentLanguage === 'en' ? 'de' : 'en';
        updateLangButton();
    });

    // Первый факт при входе на страницу
    updateLangButton();
    fetchRandomFact();
});


