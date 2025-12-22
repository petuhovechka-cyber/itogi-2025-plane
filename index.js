const container = document.querySelector('.container');
const slides = document.querySelectorAll('.slide');
const btnUp = document.getElementById('btnUp');
const btnDown = document.getElementById('btnDown');

let currentSlideIndex = 0;
let isScrolling = false; // Блокировка, чтобы не пролистывало 10 слайдов за раз

// Находим элемент подсказки
const hint = document.getElementById('scroll-hint');

function scrollToSlide(index) {
    if (index < 0 || index >= slides.length) return;
    
    isScrolling = true;
    currentSlideIndex = index;
    
    if (currentSlideIndex === 1 && window.parsePinBtns) {
        window.parsePinBtns();
    }
    // ЛОГИКА ИСЧЕЗНОВЕНИЯ ПОДСКАЗКИ:
    // Если мы ушли с первого слайда, скрываем подсказку
    if (currentSlideIndex > 0 && hint) {
        hint.style.opacity = '0';
        hint.style.pointerEvents = 'none'; // Чтобы она не мешала кликам
    }

    slides[index].scrollIntoView({
        behavior: 'smooth'
    });

    setTimeout(() => {
        isScrolling = false;
    }, 700);
}

// Управление колесиком
window.addEventListener('wheel', (e) => {
    if (isScrolling) return;

    if (e.deltaY > 0) {
        scrollToSlide(currentSlideIndex + 1);
    } else {
        scrollToSlide(currentSlideIndex - 1);
    }
}, { passive: false });

// Управление кнопками-стрелками
btnUp.addEventListener('click', () => scrollToSlide(currentSlideIndex - 1));
btnDown.addEventListener('click', () => scrollToSlide(currentSlideIndex + 1));

// Управление клавиатурой
window.addEventListener('keydown', (e) => {
    if (isScrolling) return;
    if (e.key === 'ArrowDown') scrollToSlide(currentSlideIndex + 1);
    if (e.key === 'ArrowUp') scrollToSlide(currentSlideIndex - 1);
});