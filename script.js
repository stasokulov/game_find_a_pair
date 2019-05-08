'use strict'

var game = class Game {
    constructor() {
        this.count = '';
        this.colorsBase = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8]; //Массив для создания классов, определяющих цвет.
        this.start = document.querySelector('#start');
        this.watch = document.querySelector('#timer');
        this.board;
    }

    startGame() {
        //Создаем доску
        this.createBoard();
        //Вешаем слушатель клика на кнопку 'Старт'.
        this.start.addEventListener('click', () => {
            this.startTimer();
        });
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
        let colors = [...this.colorsBase];
        for (let i = colors.length; i > 0; i--) {

            //Выбираем случайный элемент в массиве.
            const numColor = Math.floor( Math.random() * colors.length );
            const color = colors[numColor];

            //Убираем из массива этот элемент.
            colors.splice([numColor], 1);

            //Создаем клетку и записываем в дата-атрибут название класса, определяющего цвет.
            const cell = templateCell.cloneNode(true);
            cell.dataset.color = 'color' + [color];

            //Закидываем клетки на доску.
            this.board.appendChild(cell);
        };
        //Закидываем доску на страницу.
        document.body.insertBefore(this.board, document.body.firstChild);
    }

    startTimer() {
        //Очищаем игру от данных предыдущего раунда.
        this.clearGame();
        //Создаем доску (затираем предыдущую доску).
        this.createBoard();
        //Вешаем одноразовый слушатель клика на доску.
        this.board.addEventListener( 'click', this.showColor.bind(this), {once: true} );
        //Останавливаем таймер, если был запущен ранее.
        clearInterval(this.interval);
        //Фиксируем время клика и запускаем пересчет таймера каждые 0,1 секунды.
        const timeStart = new Date().getTime();
        this.interval = setInterval(() => {
            //Сколько секунд прошло с момента запуска таймера.
            let deltaSec = (new Date().getTime() - timeStart)/1000;
            //Если больше часа, то сбрасываем игру.
            if (deltaSec > 3600) {
                alert('Вы играете уже целый час. Игра остановлена.');
                clearInterval(this.interval);
                location.reload();
            };
            //Выводим количество минут и секунд через разделитель ":".
            if (deltaSec < 60) {
                this.watch.innerHTML = '00:' + deltaSec;
            } else {
                let deltaSecMin = Math.ceil(deltaSec/60); //Количество минут
                let deltaSecSec = deltaSec - deltaSecMin; //Количество секунд
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
            const dataColor = cell.dataset.color;
            cell.classList.add([dataColor]);
            //Проверяем счетчик.
            if (this.count !== '') {
                //Если там есть запись, находим предыдущую клетку.
                const waitingCell = this.board.querySelector('.waiting');
                //Сравниваем ее с цветом кликнутой клетки.
                if (this.count !== dataColor) {
                    //Если цвета разные.
                    //Убираем статус ждущей с предыдущей клетки.
                    this.markNoWaiting(waitingCell);
                    //Помечаем как закрытую предыдущую клетку.
                    this.markClose(waitingCell);
                    //Сохраняем цвет предыдущей клетки.
                    const oldColor = this.count;
                    //очищаем счетчик 
                    this.count = '';
                    //Через полсекунды.
                    const timer = setTimeout(() => {
                        //Убираем окраску кликнутой клетки.
                        cell.classList.remove([dataColor]);
                        //Убираем окраску предыдущей клетки.
                        waitingCell.classList.remove([oldColor]);
                        clearTimeout(timer);
                    }, 500);
                } else {
                    //Если цвета одинаковые - помечаем как открытую (новая клетка остается открытой).
                    this.markOpen(cell);
                    //Снимаем статус ждущей с предыдущей клетки.
                    this.markNoWaiting(waitingCell);
                    //очищаем счетчик 
                    this.count = '';
                };
            } else {
                //Если счетчик пуст - записываем в него цвет кликнутой кнопки.
                this.count = dataColor;
                //Помечаем как открытую.
                this.markOpen(cell);
                //Помечаем как ждущую результата следующего клика.
                this.markWaiting(cell);
            };
        };

        //Если закрытые клетки закончились - завершаем игру.
        let closeCells = this.board.querySelectorAll('.close');
        if (closeCells.length === 0) {
            setTimeout( () => {
                alert('Вы выиграли!\r\r Затраченное время: ' + this.watch.innerHTML);
                location.reload();
            }, 100 );
        };
        //Вешаем новый слушатель клика.
        this.board.addEventListener( 'click', this.showColor.bind(this), {once: true} );
    };

    clearGame() {
        this.board.remove();
        this.count = '';
    }

    markOpen(cell) {
        cell.classList.remove('close');
    };

    markClose(cell) {
        cell.classList.add('close');
    };

    markWaiting(cell) {
        cell.classList.add('waiting');
    };

    markNoWaiting(cell) {
        cell.classList.remove('waiting');
    };

    crateDiv() {
        const div = document.createElement('div');
        return div;
    };
}

const newGame = new game();
//const newGame = new Game();
newGame.startGame();