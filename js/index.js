window.addEventListener('DOMContentLoaded', () => {

//задание с выбором стиля питания

    const tabs = document.querySelectorAll('.tabheader__item');
    const tabsContent = document.querySelectorAll('.tabcontent');
    const tabsParent = document.querySelector('.tabheader__items')

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.style.display = 'none';
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        })
    }

    function showTabContent(i = 0) { //если ничего не передается, то по умолчанию подставится 0
        tabsContent[i].style.display = 'block';
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if(target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            })
        }
    })


    //задание с таймером

    const deadline = '2023-03-10';

    function getTimeRemaining(endtime) {
        let days, hours, minutes, seconds;
        const t = Date.parse(endtime) - Date.parse(new Date()); //принимается наш дедлайн и из него вычитается нынешняя дата
        if(t <= 0) {
            days = hours = minutes = seconds = 0;
        } else {
            days = Math.floor(t / (1000 * 60 * 60 * 24)), // наше кол-во милисекунд t делим на количество мс в одном дне
            hours = Math.floor((t / (1000 * 60 * 60)) % 24), //после деления получим кол-во часов, которое может содержаться в сутках
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);
        }

              return { //возвращаем объект со всеми значениями
                'total': t,
                'days': days,
                'hours': hours,
                'minutes': minutes,
                'seconds': seconds
            };
        }

        function getZero(num) { //функция проверки числа, если оно меньше 10 - в начало подставить 0 (для даты это может быть важно)
            if (num >=0 && num < 10) {
                return `0${num}`;
            } else {
                return num;
            }
        }

        function setClock(selector, endtime) {
            const timer = document.querySelector(selector),
                  days = timer.querySelector('#days'),
                  hours = timer.querySelector('#hours'),
                  minutes = timer.querySelector('#minutes'),
                  seconds = timer.querySelector('#seconds'),
                  timeInterval = setInterval(updateClock, 1000);

            updateClock(); //вызов функции обновления времени, так как без нее странице понадобится секунда, чтобы подгрузить актуальные значения таймера

            function updateClock() {
                const t = getTimeRemaining(endtime);

                days.innerHTML = getZero(t.days);
                hours.innerHTML = getZero(t.hours);
                minutes.innerHTML = getZero(t.minutes);
                seconds.innerHTML = getZero(t.seconds);

                if (t.total <= 0) {
                    clearInterval(timeInterval);
                }
            }
        }

        setClock('.timer', deadline);


        //задание с модальными окнами (присутствуют небольшие модификации html)

        const openModal = document.querySelectorAll('[data-modal]'),
              modalWindow = document.querySelector('.modal'),
              closeModal = document.querySelector('.modal__close')

        openModal.forEach(el => {
            el.addEventListener('click', openModalFunc)

            closeModal.addEventListener('click', closeModalFunc)

            modalWindow.addEventListener('click', (event) => {
                if(event.target == modalWindow)
                closeModalFunc();
            })
        });

        function openModalFunc() {
            modalWindow.style.display = 'block';
            document.body.style.overflow = 'hidden';
            clearInterval(modalTimerId);
        }

        function closeModalFunc() { //функция создана чтобы избежать участков повторения кода
            modalWindow.style.display = 'none';
            document.body.style.overflow = '';
            window.removeEventListener('scroll', showModalByScroll);
        }

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape' && modalWindow.style.display === 'block')
                closeModalFunc();
        })  

        // const modalTimerId = setTimeout(openModalFunc, 3000);

        function showModalByScroll() {
            if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight)
                openModalFunc();
        }

        window.addEventListener('scroll', showModalByScroll) //{once: true} - можно было бы использовать такой метод, если бы отслеживание велось не на окно. Этот метод позволяет выполнить addEventListener лишь единожды


        //задание с генерацией меню посредством классов

        class Menu {
            constructor(image, title, text, price, parentSelector, ...classes) {
                this.image = image;
                this.title = title;
                this.text = text;
                this.price = price;
                this.classes = classes;
                this.parent = document.querySelector(parentSelector);
                this.transfer = 27; //выдуманный курс валюты 
                this.changeToUAH();
            }

            changeToUAH() {
                this.price = this.price * this.transfer;
            }

            render() {
                const element = document.createElement('div');

                if(this.classes.length === 0) {
                    this.val = 'menu__item';
                    element.classList.add(this.val)
                } else {
                    this.classes.forEach(className => element.classList.add(className));
                }

                element.innerHTML = `
                    <img src=${this.image} alt="vegy">
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.text}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
                `;
                this.parent.append(element);
            }
        }

        new Menu(
            "img/tabs/vegy.jpg",
            'Меню "Фитнес"',
            'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
            9,
            '.menu .container'
        ).render();
        new Menu(
            "img/tabs/elite.jpg",
            'Меню “Премиум”',
            'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
            14,
            '.menu .container'
        ).render();
        new Menu(
            "img/tabs/post.jpg",
            'Меню "Постное"',
            'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
            21,
            '.menu .container'
        ).render();
    
})


// class Rectangle {
// 	constructor(height, width){
// 		this.height = height;
// 		this.width = width;
// 	}
	
// 	calcArea() {
// 		return this.height * this.width;
// 	}
// }

// const square = new Rectangle(10, 10);
// console.log(square.height)