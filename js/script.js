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
    modalWindow = document.querySelector('.modal');

function displayModal() {
    modalWindow.classList.remove('hide');
    document.body.style.overflow = 'hidden';
    clearInterval(modalTimeout);
}

function hideModal() {
    modalWindow.classList.add('hide');
    document.body.style.overflow = '';
}

// open modal throw time
const modalTimeout = setTimeout(displayModal, 50000);

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

    if (target.classList.contains('modal') || target.classList.contains('modal__close')) {
        hideModal();
    }
});

document.addEventListener('keydown', event => {
    if (!modalWindow.classList.contains('hide') && event.key == 'Escape') {
        hideModal();
    }
});



// Card class
class MenuCard {
    constructor(name, descr, cost, img, alt, ...classes) {
        this.name = name;
        this.descr = descr;
        this.cost = cost;
        this.img = img;
        this.alt = alt;
        this.classes = classes;
    }

    createCard() {
        const innerHTML = `
                <img src="${this.img}" alt="${this.alt}">
                <h3 class="menu__item-subtitle">${this.name}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.cost}</span> руб/день</div>
                </div>
        `;

        const elem = document.createElement('div');
        elem.classList.add('menu__item');
        for (let currClass of this.classes) {
            elem.classList.add(currClass);
        }
        elem.innerHTML = innerHTML;

        return elem;
    }
}

const menuContainer = document.querySelector('.menu__field .container');

const getData = async (url) => {
    const data = await fetch(url);

    if (!data.ok) {
        throw new Error(`Server error: ${url}`);
    }

    return await data.json();
};

getData('http://localhost:3000/menu')
    .then(data => {
        data.forEach(({img, altimg, title, descr, price}) => { // Деструктуризация объекта
            const card = new MenuCard(
                title,
                descr,
                price,
                img,
                altimg
            );

            menuContainer.append(card.createCard());
        });
    })
    .catch((error) => {
        console.error(error);
    });

// Forms

const forms = document.querySelectorAll('form');

const message = {
    loading: 'img/form/spinner.svg',
    success: 'Спасибо, мы скоро с вами свяжемся',
    fail: 'Что-то пошло не так...'
};

const postData = async (url, data) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: data
    });

    if (!res.ok) {
        throw new Error(`Server error: ${url}`);
    }

    return await res.json();
};

function bindPostData(form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const statusMessage = document.createElement('img');
        statusMessage.src = message.loading;
        statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;
        `;
        form.append(statusMessage);

        // отправка данных с fetch
        // использование promise

        // Formdata
        const formData = new FormData(form);

        // JSON
        const jsonData = JSON.stringify(Object.fromEntries(formData.entries()));
        console.log(jsonData);

        postData('http://localhost:3000/requests', jsonData)
        .then(data => {
            console.log(data);
            showThanksModal(message.success);
            statusMessage.remove();
        })
        .catch(() => {
            showThanksModal(message.fail);
        })
        .finally(() => {
            form.reset();
        });
    });
}

function showThanksModal(message) {
    const prevModalDialog = document.querySelector('.modal__dialog');
    prevModalDialog.classList.add('hide');

    displayModal();

    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `
        <div class="modal__content">
            <div class="modal__close">×</div>
            <div class="modal__title">${message}</div>
        </div>
    `;

    document.querySelector('.modal').append(thanksModal);
    setTimeout(() => {
        thanksModal.remove();
        prevModalDialog.classList.remove('hide');
        hideModal();
    }, 4000);
}

forms.forEach(form => {
    bindPostData(form);
});


// slider
const slider = document.querySelector('.offer__slider'),
    slides = slider.querySelectorAll('.offer__slide'),
    arrowPrev = slider.querySelector('.offer__slider-prev'),
    arrowNext = slider.querySelector('.offer__slider-next'),
    currentSliderNumber = slider.querySelector('#current'),
    totalSliderNumber = slider.querySelector('#total');

let currentSlide = 0;
const slideLength = slides.length;

function initSlider() {
    currentSliderNumber.textContent = getNumberFormat(`${currentSlide + 1}`);
    totalSliderNumber.textContent = getNumberFormat(`${slideLength}`);

    hideAllSlides(slides);
    slides[currentSlide].classList.remove('hide');
}

function hideAllSlides(slides) {
    slides.forEach(slide => {
        slide.classList.add('hide');
    });
}

function showSlide(n) {
    hideAllSlides(slides);
    slides[n].classList.remove('hide');
}

function showNextSlide() {
    currentSlide = (currentSlide + 1) % slideLength;
    showSlide(currentSlide);
    currentSliderNumber.textContent = getNumberFormat(`${currentSlide + 1}`);
}

function showPrevSlide() {
    currentSlide--;
    currentSlide = currentSlide < 0 ? slideLength - 1 : currentSlide;
    showSlide(currentSlide);
    currentSliderNumber.textContent = getNumberFormat(`${currentSlide + 1}`);
}

initSlider();

arrowPrev.addEventListener('click', showPrevSlide);
arrowNext.addEventListener('click', showNextSlide);
