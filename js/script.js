// Tabs

const tabs = document.querySelectorAll('.tabheader__item'),
    tabsContent = document.querySelectorAll('.tabcontent'),
    tabsContainer = document.querySelector('.tabheader__items');

function hideTabContent() {
    tabsContent.forEach(tab => {
        tab.style.display = 'none';
    });

    tabs.forEach(tab => {
        tab.classList.remove('tabheader__item_active');
    });
}

function showTabContent(n = 0) {
    tabsContent[n].style.display = 'block';
    tabs[n].classList.add('tabheader__item_active');
}

hideTabContent();
showTabContent(2);

tabsContainer.addEventListener('click', (event) => {
    const target = event.target;

    if (target && target.classList.contains('tabheader__item')) {
        tabs.forEach((tab, i) => {
            if (tab == target) {
                hideTabContent();
                showTabContent(i);
            }
        });
    }
});


// Timer
const deadline = new Date();
deadline.setDate(deadline.getDate() + 3);

function getTimeRemaining(endTime) {
    const delta = endTime - new Date(),
        days = Math.floor(delta / (1000 * 60 * 60 * 24)),
        hours = Math.floor(delta / (1000 * 60 * 60) % 24),
        minutes = Math.floor(delta / (1000 * 60) % 60),
        seconds = Math.floor(delta / 1000 % 60);

    return {
        'total': delta,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    };
}

function getNumberFormat(n) {
    return n < 10 && n >= 0 ? `0${n}` : n;
}

function setClock(selector, endTime) {
    const timer = document.querySelector(selector),
        days = timer.querySelector('#days'),
        hours = timer.querySelector('#hours'),
        minutes = timer.querySelector('#minutes'),
        seconds = timer.querySelector('#seconds'),
        timeInterval = setInterval(updateClock, 1000);

    updateClock();

    function updateClock() {
        const t = getTimeRemaining(endTime);

        days.textContent = getNumberFormat(t.days);
        hours.textContent = getNumberFormat(t.hours);
        minutes.textContent = getNumberFormat(t.minutes);
        seconds.textContent = getNumberFormat(t.seconds);

        if (t.total <= 0) {
            clearInterval(timeInterval);

            days.textContent = '00';
            hours.textContent = '00';
            minutes.textContent = '00';
            seconds.textContent = '00';
        }
    }
}

setClock('.timer', deadline);


// Modal window
const buttonsOpen = document.querySelectorAll('[data-model]'),
    buttonClose = document.querySelector('.modal__close'),
    modalWindow = document.querySelector('.modal');

function displayModal() {
    modalWindow.classList.toggle('hide');
    document.body.style.overflow = 'hidden';
    clearInterval(modalTimeout);
}

function hideModal() {
    modalWindow.classList.toggle('hide');
    document.body.style.overflow = '';
}

// open modal throw time
const modalTimeout = setTimeout(displayModal, 5000);

// open in the end of the page
function showModalByScroll() {
    if (document.documentElement.scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 1) {
        displayModal();
        window.removeEventListener('scroll', showModalByScroll);
    }
}

window.addEventListener('scroll', showModalByScroll);

// open modal window
buttonsOpen.forEach(button => {
    button.addEventListener('click', displayModal);
});

// close modal window
modalWindow.addEventListener('click', event => {
    const target = event.target;

    console.log(target);

    if (target.classList.contains('modal')) {
        hideModal();
    }

    if (target == buttonClose) {
        hideModal();
    }
});

document.addEventListener('keydown', event => {
    if (modalWindow.classList.contains('show') && event.key == 'Escape') {
        hideModal();
    }
});



// Card class
class MenuCard {
    constructor(name, descr, cost, img, alt) {
        this.name = name;
        this.descr = descr;
        this.cost = cost;
        this.img = img;
        this.alt = alt;
    }

    createCard() {
        const innerHTML = `
                <img src="img/tabs/${this.img}" alt="${this.alt}">
                <h3 class="menu__item-subtitle">Меню “${this.name}”</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.cost}</span> руб/день</div>
                </div>
        `;

        const elem = document.createElement('div');
        elem.classList.add('menu__item');
        elem.innerHTML = innerHTML;

        return elem;
    }
}

const menuContainer = document.querySelector('.menu__field .container');
const firstMenu = new MenuCard(
    'Премиум',
    'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
    '1450',
    'elite.jpg',
    'elite'
);

const secondMenu = new MenuCard(
    'Фитнес',
    'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
    '1100',
    'vegy.jpg',
    'vegy'
);

const thirdMenu = new MenuCard(
    'Постное',
    'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
    '1270',
    'post.jpg',
    'post'
);

menuContainer.append(thirdMenu.createCard());
menuContainer.append(firstMenu.createCard());
menuContainer.append(secondMenu.createCard());



