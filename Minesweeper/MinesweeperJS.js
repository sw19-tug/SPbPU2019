'use strict';

var Minesweeper = function (obj) {
    this.status = '';

    //все соседние позиции конкретного поля
    this.directions =   [[-1, -1], [-1, 0], [-1, 1],
                        [0,  -1],          [0,  1],
                        [1,  -1], [1,  0], [1,  1]];

    //выставляем параметры
    //TODO: значения по дефолту
    this.height = obj.height;
    this.width = obj.height;
    this.mines = obj.mines;
    //грид - поле
    this.grid = [];

    this.location = document.querySelector(obj.location || '#board');

    //добавляем листенер, который слушает клики мышкой
    this.location.addEventListener('mouseup', function (e) {

        //в первом фильтре пропускаются только те таргеты, у которых айди начинается со "square"
        if (e.target.id.match(/square.*/)) {
            //если лефтклик
            if (e.which === 1) {
                if (this.status === 'intializing') {

                    //добавляем мины на поле, если статус - инициализация
                    this.add_mines(this.id_to_pos(e.target.id))
                } else if (this.status === 'playing') {

                    //чекаем клинкутую позицию, если статус - игра
                    this.check(this.id_to_pos(e.target.id), false, true)
                }
                // console.log('left click on ' + e.target.id)
            }
            //TODO: добавить флаги по райтклику
        }
    }.bind(this));
    //TODO: добавить превентивное поведение для райтклика
    this.init();
};

//эта функция отрисовывает поле (с нуля)
Minesweeper.prototype.init = function () {
    var h, w;
    this.status = 'intializing';
    this.location.innerHTML = ''; //отчищаем поле локации, обнуляем массив
    this.grid = [];

    for (h = 0; h < this.height; h++) {
        var row = [];

        for (w = 0; w < this.width; w++) { //создаем ячейку и пушим в дорожку
            var square = new Square();
            row.push(square)
        }
        this.grid.push(row) //дорожки пушим в массив с разметкой
    }

    var grid_element = document.createElement('div');
    grid_element.className = 'grid'; //создаем грид-элемент

    for (h = 0; h < this.height; h++) { //наполняем его дорожками, а внутри дорожек - полями
        var row_element = document.createElement('div');
        row_element.className = 'row';
        for (w = 0; w < this.width; w++) {
            var square_element = document.createElement('div');
            square_element.className = 'square';
            square_element.id = 'square[' + h + '][' + w + ']';
            row_element.appendChild(square_element)
        }
        grid_element.appendChild(row_element)
    }
    this.location.appendChild(grid_element) //помещаем получившееся поле под тег локации
};

Minesweeper.prototype.add_mines = function (pos) {
//чувак кликает по квадратику
    do {
        var neighbors = 0; //обнуляем соседей
        var h, w;
        for (h = 0; h < this.height; h++) {
            for (w = 0; w < this.width; w++) {
                this.grid[h][w].mine = false; //обнуляем мины
            }
        }
        for (var mine_counter = 0; mine_counter < this.mines; mine_counter++) {
            var mine_placed = false;
            while (!mine_placed) { //рандомно назначаем мины на поле
                var r1 = this.rand(0, this.height - 1);
                var r2 = this.rand(0, this.width - 1);
                if (!this.grid[r1][r2].mine) { //если в том же месте нет мины - только тогда ставим новую
                    this.grid[r1][r2].mine = true;
                    mine_placed = true
                }
            }
        }
        this.directions.forEach(function (e) {
            if (this.check([(parseInt(pos[0], 10) + parseInt(e[0], 10)),
                (parseInt(pos[1], 10) + parseInt(e[1], 10))], true)) {
                neighbors++
            }
        }.bind(this))
    }
    while (this.grid[pos[0]][pos[1]].mine || neighbors !== 0); //вокруг кликнутого квадратика не должно быть мин
    //или сам кликнутый квадратик не должен быть миной

    // !this.grid[pos[0]][pos[1]].mine && neighbors == 0 - чтобы выйти из цикла
    // в общем: кликнутый квадратик не мина и у него нет соседей мин - тогда мы прекращаем расставлять мины
    this.status = 'playing';
    this.check(pos, false)
};
//
Minesweeper.prototype.check = function (pos, checking, clicked) { //флаг чекинг нужен для того, чтобы проверить бомбы
    var y = pos[0];
    var x = pos[1];
    if ((y >= 0) && (y < this.height) && (x >= 0) && (x < this.width)) { //если не вылезает за границы
        var cur = this.grid[pos[0]][pos[1]]; //берем нажатый квадратик
        if ((clicked && !cur.flag && !cur.question && !cur.activated) //если это ни флажок, ни вопрос
            || (!clicked && !cur.activated)) { //если не клик, и не активирован
            if (cur.mine) {//если нажатый квадратик - мина, проигрыш и показываем все мины
                if (!checking) {
                    console.log(cur);
                    this.pos_to_element([y, x]).className = 'square mine'
                    //TODO: проигрыш
                } else {
                    return true
                }
            } else if (!checking) { //если не мина, а чек = ложь
                var neighbors = 0;
                this.directions.forEach(function (e) {
                    if (this.check([(parseInt(y, 10) + parseInt(e[0], 10)),
                        (parseInt(x, 10) + parseInt(e[1], 10))], true)) {
                        neighbors++
                    }
                }.bind(this)); //считаем количество соседей-бомб

                if (neighbors === 0) { //если соседей нет, то активируем нажатый квадрат и все вокруг него тоже чекаем (рекурсивно)
                    this.pos_to_element(pos).classList.add('activated');
                    this.grid[y][x].activated = true; //TODO: вынести за иф
                    this.directions.forEach(function (e) {
                        (this.check([(parseInt(y, 10) + parseInt(e[0], 10)),
                            (parseInt(x, 10) + parseInt(e[1], 10))], false))
                    }.bind(this))
                } else {
                    //TODO: циферки в блоках
                    this.pos_to_element(pos).classList.add('activated');
                    this.grid[y][x].activated = true
                }
                // console.log('[' + y + '][' + x + '] has neighbors: ' + neighbors)
            } else if (checking) {
                return false
            }
        }
    }
    //TODO: проверить вин
};
//TODO: функция установки флага
//TODO: функция проверки вина
//TODO: функция вывода сообщения

Minesweeper.prototype.id_to_pos = function (id) {
    var id_matches = id.match(/(\w+)\[(\d+)\]\[(\d+)\]/);
    return [id_matches[2], id_matches[3]]
};
//
Minesweeper.prototype.pos_to_element = function (pos) {
    return document.getElementById('square[' + pos[0] + '][' + pos[1] + ']')
};
Minesweeper.prototype.grid_to_id = function (y, x, key, value) {
  document.getElementById('square[' + y + '][' + x + ']')[key] = value
};
//
Minesweeper.prototype.rand = function (min, max, round) {
    if (round === false) {
        return (Math.random() * (max - min)) + min
    } else {
        return Math.round((Math.random() * (max - min)) + min)
    }
};

var Square = function () {
    this.activated = false;
    this.mine = false;
    this.flag = false;
    this.question = false
};

var Game = new Minesweeper({ 'location': '#board',
    'height': 8,
    'width': 8,
    'mines': 10 });
