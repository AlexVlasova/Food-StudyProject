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
}

function hideModal() {
    modalWindow.classList.toggle('hide');
    document.body.style.overflow = '';
}

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
