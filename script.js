'use strict'

class Game {
    constructor() {
        this.count = '';
        this.colors = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8]; //Массив для создания классов, определяющих цвет.
        this.start = document.querySelector('#start');
        this.watch = document.querySelector('#timer');
        this.board;
    }

    createBoard() {
        //Создаем доску, отрисовываем стартовые цифры секундомера.
        this.board = this.crateDiv();
        this.board.classList.add('board');
        this.watch.innerText = '00:00.0';

        //Создаем шаблон клетки
        const templateCell = this.crateDiv();
        templateCell.classList.add('cell');
        templateCell.classList.add('close');

        //Выбираем все цвета по-одному в случайном порядке, красим клетку, заполняем доску.
        for (let i = this.colors.length; i > 0; i--) {

            //Выбираем случайный элемент в массиве.
            const numColor = Math.floor( Math.random() * this.colors.length );
            const color = this.colors[numColor];

            //Убираем из массива этот элемент.
            this.colors.splice([numColor], 1);

            //Создаем клетку и записываем в дата-атрибут название класса, определяющего цвет.
            const cell = templateCell.cloneNode(true);
            cell.dataset.color = 'color' + [color];

            //Закидываем клетки на доску, а доску на страницу.
            this.board.appendChild(cell);
            document.body.insertBefore(this.board, document.body.firstChild);
        };

        //Вешаем слушатель клика на кнопку 'Старт'.
        this.start.addEventListener('click', () => {
            //Вешаем слушатель клика на доску.
            this.board.addEventListener( 'click', this.showColor.bind(this) );
            //Запускаем таймер.
            this.timerStart();
        });
    }

    timerStart() {
        //Фиксируем время клика и запускаем пересчет таймера каждые 0,1 секунды.
        let timer = new Date().getTime();
        const interval = setInterval(() => {
            //Сколько секунд прошло с момента запуска таймера.
            let deltaSec = (new Date().getTime() - timer)/1000;
            //Если больше часа, то сбрасываем игру.
            if (deltaSec > 3600) {
                alert('Вы играете уже целый час. Игра остановлена.');
                clearInterval(interval);
                location.reload();
            };
            //Выводим количество минут и секунд через разделитель ":".
            if (deltaSec < 60) {
                this.watch.innerHTML = '00:' + deltaSec;
            } else {
                let deltaSecMin = Math.ceil(deltaSec/60);
                let deltaSecSec = deltaSec - deltaSecMin;
                this.watch.innerHTML = deltaSecMin + ":" + deltaSecSec;
            };
        }, 100);
    }

    //Записываем цвет открытой клетки в счетчик. При открытии новой клетки, сравниваем счетчик с ее цветом.
    //При совпадении - оставляем вторую клетку открытой и опустошаем счетчик. При не совпадении - закрываем новую клетку.
    showColor (event) {
        const cell = event.target;
        //Реагируем только на клик по закрытой клетке.
        if ( cell.classList.contains('close') ) {
            //Берем строку из атрибута data и присваиваем ее как класс.
            const data = cell.dataset.color;
            cell.classList.add([data]);

            //Проверяем счетчик.
            if (this.count !== '') {
                //Если там есть запись, то сравниваем ее с цветом кликнутой клетки.
                if (this.count !== data) {
                    //Если цвета разные, то убираем окраску кликнутой клетки.
                    const timer = setTimeout(() => {
                        cell.classList.remove([data]);
                        clearTimeout(timer);
                    }, 500);
                } else {
                    //Если цвета одинковые - очищаем счетчик (новая клетка остается открытой).
                    this.count = '';
                    //Помечаем как открытую.
                    this.markOpen(cell);
                };
            } else {
                //Если счетчик пуст - записываем в него цвет кликнутой кнопки.
                this.count = data;
                //Помечаем как открытую.
                this.markOpen(cell);
            };
        };

        //Если закрытые клетки закончились - завершаем игру.
        let closeCells = this.board.querySelectorAll('.close');
        if (closeCells.length === 0) {
            alert('Вы выиграли!\r\r Затраченное время: ' + this.watch.innerHTML);
            location.reload();
        }; 
    };

    markOpen(cell) {
        cell.classList.remove('close');
    };

    crateDiv() {
        const div = document.createElement('div');
        return div;
    };
}

const newGame = new Game();
newGame.createBoard();












