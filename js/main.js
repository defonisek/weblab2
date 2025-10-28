document.addEventListener('DOMContentLoaded', function() {
    console.log('Главная страница загружена');
    
    // Можно добавить дополнительную логику здесь при необходимости
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});
