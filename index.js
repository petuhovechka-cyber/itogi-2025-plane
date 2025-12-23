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
    
    // Добавь это в свою функцию scrollToSlide(index)
    if (index === 2) { // 3-й слайд
        const rows = document.querySelectorAll('.stats-row');
        rows[0].style.opacity = '0';
        rows[0].style.transform = 'translateX(-50px)';
        rows[1].style.opacity = '0';
        rows[1].style.transform = 'translateX(50px)';

        setTimeout(() => {
            rows[0].style.transition = 'all 0.8s ease';
            rows[0].style.opacity = '1';
            rows[0].style.transform = 'translateX(0)';
            
            rows[1].style.transition = 'all 0.8s ease 0.3s';
            rows[1].style.opacity = '1';
            rows[1].style.transform = 'translateX(0)';
        }, 100);
    }
    if (index === 7) {
        const mathScore = document.getElementById('math-value');
        const flash = document.getElementById('flash');

        setTimeout(() => {
            // 1. Вспышка и замена на 3
            flash.style.opacity = '1';
            mathScore.innerText = '3';
            mathScore.classList.add('glitch-active');

            // 2. Убираем вспышку быстро
            setTimeout(() => {
                flash.style.opacity = '0';
            }, 50);

            // 3. Возвращаем 8 через 200мс (эффект короткого глюка)
            setTimeout(() => {
                mathScore.innerText = '8';
                mathScore.classList.remove('glitch-active');
            }, 200);

        }, 1000); // Задержка в 1 секунду
    }   
    if (index === 4) { // 5-й слайд
        const content = document.querySelector('.mmlbb-troll');
        content.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
    }

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

// 1. Списки имен файлов (cards/имя.avif)
const deckA = ['valkyrie', 'witch', 'bomber', 'cannon', 'prince', 'the-log', 'fireball', 'archers'];
const deckB = ['mega-knight', 'pekka', 'sparky', 'three-musketeers', 'royal-recruits', 'elite-barbarians', 'electro-giant', 'golem'];

// 2. Функция отрисовки колоды
function drawDeck(cards) {
    const grid = document.getElementById('cardsGrid');
    if (!grid) return;
    // Создаем карточки и сразу добавляем им класс для анимации появления, если нужно
    grid.innerHTML = cards.map(name => `
        <div class="card-item">
            <img src="cards/${name}.avif" alt="${name}">
        </div>
    `).join('');
}

// 3. Инициализация при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    drawDeck(deckA);
});

// 4. Главная функция генерации
function generateNormalDeck() {
    const items = document.querySelectorAll('.card-item');
    const elixirText = document.getElementById('elixirValue');
    const elixirBadge = document.querySelector('.elixir-badge');
    
    if (!items.length) return;

    // 1. АНИМАЦИЯ КАРТ (УХОД)
    items.forEach((card, i) => {
        // Убеждаемся, что класс добавляется
        setTimeout(() => {
            card.classList.add('magic-effect');
        }, i * 50);
    });

    // 2. АНИМАЦИЯ ЭЛИКСИРА (ГЕОМЕТРИЧЕСКАЯ ПРОГРЕССИЯ)
    // Массив значений: 3.5 -> 4.0 -> 10.0 -> 100.0 -> ∞
    const stages = ['4.0', '5.0', '6.0', '7.0', '8.0', '9.0', '10.0', '50.0', '100.0', 'inf'];
    // Задержки между шагами (уменьшаются, чтобы было ускорение)
    const delays = [200, 100, 50, 50, 30, 30, 20, 20, 10]; 

    let currentStage = 0;

    const boostElixir = () => {
        if (currentStage < stages.length) {
            // Менее выразительная анимация (просто легкая пульсация)
            elixirBadge.style.transform = 'scale(1.1)';
            elixirText.innerText = stages[currentStage];
            
            setTimeout(() => {
                elixirBadge.style.transform = 'scale(1)';
                currentStage++;
                if (currentStage < stages.length) {
                    // Берем задержку из массива для эффекта ускорения
                    setTimeout(boostElixir, delays[currentStage - 1]);
                }
            }, 100);
        }
    };

    // Запускаем эликсир чуть позже начала исчезновения карт
    setTimeout(boostElixir, 300);

    // 3. СМЕНА КАРТ И ПОЯВЛЕНИЕ
    setTimeout(() => {
        drawDeck(deckB); 
        
        const newItems = document.querySelectorAll('.card-item');
        // Принудительно ставим класс невидимости перед проявлением
        newItems.forEach(c => c.classList.add('magic-effect'));

        // Ждем один кадр, чтобы браузер применил класс, и плавно проявляем
        requestAnimationFrame(() => {
            newItems.forEach((card, i) => {
                setTimeout(() => {
                    card.classList.remove('magic-effect');
                }, i * 50);
            });
        });
    }, 800); 
}

// Массив с номерами фото (1.jpg, 2.jpg и т.д.)
const photoNumbers = [1, 2, 3, 4, 5, 6];

function initGifts() {
    const grid = document.getElementById('giftsGrid');
    if (!grid) return;

    // Перемешиваем массив для разного порядка
    const shuffled = photoNumbers.sort(() => Math.random() - 0.5);

    grid.innerHTML = shuffled.map(num => `
        <div class="gift-container" onclick="openGift(this)">
            <div class="gift-box">🎁</div>
            <img src="photos/${num}.jpg" class="gift-photo" alt="Moment">
        </div>
    `).join('');
}

function openGift(element) {
    if (!element.classList.contains('opened')) {
        element.classList.add('opened');
        
        // Можно добавить звук праздника, если хочешь
        // new Audio('pop.mp3').play(); 
    }
}

// Запускаем при загрузке
window.addEventListener('DOMContentLoaded', initGifts);

// Переменные для отслеживания касания
let touchStartY = 0;
let touchEndY = 0;

// Регистрация начала касания
window.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

// Регистрация конца касания и расчет свайпа
window.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeDistance = touchStartY - touchEndY;
    const threshold = 50; // Минимальное расстояние для срабатывания свайпа

    if (Math.abs(swipeDistance) > threshold) {
        if (swipeDistance > 0) {
            // Свайп вверх -> следующий слайд
            scrollToSlide(currentSlideIndex + 1);
        } else {
            // Свайп вниз -> предыдущий слайд
            scrollToSlide(currentSlideIndex - 1);
        }
    }
}