//Создаем доску и счетчик цветов, отрисовываем стартовые цифры секундомера.
const board = crateDiv();
board.classList.add('board');
const watch = document.querySelector('#timer');
watch.innerText = '00:00.0';
let count = '';

//Запускаем построение доски.
(function crateBoard() {

    //Создаем шаблон клетки
    const templateCell = crateDiv();
    templateCell.classList.add('cell');
    templateCell.classList.add('close');
    
    //Массив цветов
    const colors = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8];
    const amountColors = colors.length;

    //Выбираем все цвета по-одному в случайном порядке.
    for (let i = amountColors; i > 0; i--) {

        //Выббираем случайный элемент в массиве.
        const numColor = Math.floor( Math.random() * colors.length );
        const color = colors[numColor];

        //Убираем из массива этот элемент.
        colors.splice([numColor], 1);

        //Создаем клетку и присваиваем ей цвет.
        const cell = templateCell.cloneNode(true);
        cell.dataset.color = 'color' + [color];

        //Закидываем клетки на доску, а доску на страницу.
        board.appendChild(cell);
        document.body.insertBefore(board, document.body.firstChild);
    }
})();

//Вешаем слушатель клика на кнопку 'Старт'.
const start = document.querySelector('#start');
start.addEventListener('click', () => {
    //Вешаем слушатель клика на доску.
    board.addEventListener('click', showColor);
    //Запускаем таймер.
    timerStart();
});

function timerStart() {
    //Фиксируем время клика и запускаем пересчет таймера каждые 0,1 секунды.
    let timer = new Date().getTime();
    const interval = setInterval(timerFunc, 100);

    function timerFunc () {
        //Сколько секунд прошло с момента запуска таймера.
        let deltaSec = (new Date().getTime()-timer)/1000;
        //Если больше часа, то сбрасываем игру.
        if (deltaSec > 3600) {
            alert('Вы играете уже целый час. Игра остановлена.');
            clearInterval(interval);
            location.reload();
        };
        //Выводим количество минут и секунд через разделитель ":".
        if (deltaSec < 60) {
            watch.innerHTML = '00:' + deltaSec;
        } else {
            let deltaSecMin = Math.ceil(deltaSec/60);
            let deltaSecSec = deltaSec - deltaSecMin;
            watch.innerHTML = deltaSecMin + ":" + deltaSecSec;
        };
    };   
};

//Записываем цвет открытой клетки в счетчик. При открытии новой клетки, сравниваем счетчик с ее цветом.
//При совпадении - оставляем вторую клетку открытой и опустошаем счетчик. При не совпадении - закрываем новую клетку.
function showColor (event) {
    const cell = event.toElement;
    //Реагируем только на клик по закрытой клетке.
    if ( cell.classList.contains('close') ) {
        //Берем строку из атрибута data и присваиваем ее как класс.
        const data = cell.dataset.color;
        cell.classList.add([data]);

        //Проверяем счетчик.
        if (count !== '') {
            //Если там есть запись, то сравниваем ее с цветом кликнутой клетки.
            if (count !== data) {
                //Если цвета разные, то убираем окраску кликнутой клетки.
                const timer = setTimeout(() => {
                    cell.classList.remove([data]);
                    clearTimeout(timer);
                }, 500);
            } else {
                //Если цвета одинковые - очищаем счетчик (новая клетка остается открытой).
                count = '';
                //Помечаем как открытую.
                markOpen(cell);
            };
        } else {
            //Если счетчик пуст - записываем в него цвет кликнутой кнопки.
            count = data;
            //Помечаем как открытую.
            markOpen(cell);
        };
    };
    let closeCells = board.querySelectorAll('.close');
    if (closeCells.length === 0) {
        alert('Вы выиграли!\r\r Затраченное время: ' + watch.innerHTML);
        location.reload();
    }; 
};

function markOpen(cell) {
    cell.classList.remove('close');
};

function crateDiv() {
    const div = document.createElement('div');
    return div;
};
