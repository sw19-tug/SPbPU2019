'use strict';

var Minesweeper = function (obj) {
    this.status = '';

    //все соседние позиции конкретного поля
    this.directions = [[-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]];

    //выставляем параметры
    //TODO: значения по дефолту
    this.height = obj.height || 8;
    this.width = obj.height || 8;
    this.mines = obj.mines || 10;
    this.flagCounter = obj.mines;
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
                    this.check_win_state();
                }
                // console.log('left click on ' + e.target.id)
            } else if (e.which === 3) {
                if (this.status === 'playing') {
                    this.flag(this.id_to_pos(e.target.id));
                }
                // console.log('right click on ' + e.target.id)
            }
        }
    }.bind(this));
    this.location.addEventListener('contextmenu', function (e) {
        e.preventDefault()
    });
    this.init();
};

Minesweeper.prototype.check_flags = function () { //функция проверяет, все ли мины помечены флагами
    var res = true;
    var counter = 0;
    this.grid.forEach(row => {
        row.forEach(el => {
            if (el.mine) {
                res = res && el.flag;
                counter++;
            }
        });
    });
    if (counter === 0) return false;
    else return res;
};

//эта функция отрисовывает поле (с нуля)
Minesweeper.prototype.init = function () {
    var h, w;
    this.status = 'intializing';
    this.location.innerHTML = ''; //отчищаем поле локации, обнуляем массив
    this.grid = [];
    this.flagCounter = this.mines;
    document.getElementById('flag-counter').innerHTML = 'flags left: ' + this.flagCounter;
    document.getElementById('stats').innerHTML = '';

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
    this.check(pos, false);
};

Minesweeper.prototype.check = function (pos, checking, clicked) { //флаг чекинг нужен для того, чтобы проверить бомбы
    var y = pos[0];
    var x = pos[1];
    if ((y >= 0) && (y < this.height) && (x >= 0) && (x < this.width)) { //если не вылезает за границы
        var cur = this.grid[pos[0]][pos[1]]; //берем нажатый квадратик
        if ((clicked && !cur.flag && !cur.question && !cur.activated) //если это ни флажок, ни вопрос
            || (!clicked && !cur.activated)) { //если не клик, и не активирован
            if (cur.mine) {//если нажатый квадратик - мина, проигрыш и показываем все мины
                if (!checking) {
                    this.status = 'lost';
                    var h, w;
                    for (h = 0; h < this.height; h++) {
                        for (w = 0; w < this.width; w++) {
                            if (this.grid[h][w].mine) {
                                this.pos_to_element([h, w]).className = 'square mine'
                            }
                        }
                    }
                    Game.show_message('You lost!', 'Reset', 'lost', function () {
                        this.init()
                    }.bind(this))
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

                if (this.pos_to_element(pos).classList.contains('flag') || this.pos_to_element(pos).classList.contains('question')) {
                    this.flag(pos, true);
                }
                this.grid[y][x].activated = true;
                this.pos_to_element(pos).classList.add('activated');

                if (neighbors === 0) { //если соседей нет, то активируем нажатый квадрат и все вокруг него тоже чекаем (рекурсивно)
                    this.directions.forEach(function (e) {
                        (this.check([(parseInt(y, 10) + parseInt(e[0], 10)),
                            (parseInt(x, 10) + parseInt(e[1], 10))], false))
                    }.bind(this))
                } else {
                    this.pos_to_element(pos).innerHTML = neighbors;
                    this.pos_to_element(pos).dataset.neighbors = neighbors;

                }
                // console.log('[' + y + '][' + x + '] has neighbors: ' + neighbors)
            } else if (checking) {
                return false
            }
        }
    }
};

Minesweeper.prototype.flag = function (pos, remove = false) {
    var cur = this.grid[pos[0]][pos[1]];
    if (remove) {
        if (this.pos_to_element(pos).classList.contains('flag')){
            this.pos_to_element(pos).classList.remove('flag');
            this.flagCounter++;
        }
        if(this.pos_to_element(pos).classList.contains('question')){
            this.pos_to_element(pos).classList.remove('question');
        }
        cur.question = false;
        cur.flag = false;

    } else {
        if (!cur.activated) {
            if (!cur.flag && !cur.question && this.flagCounter > 0) {
                cur.flag = true;
                this.pos_to_element(pos).classList.add('flag');
                this.flagCounter--;
            } else if (cur.flag && !cur.question) {
                cur.flag = false;
                cur.question = true;
                this.pos_to_element(pos).classList.remove('flag');
                this.flagCounter++;
                this.pos_to_element(pos).classList.add('question')
            } else if (!cur.flag && cur.question) {
                cur.question = false;
                this.pos_to_element(pos).classList.remove('question');
            }
        }
        this.check_win_state();
    }
    document.getElementById('flag-counter').innerHTML = 'flags left: ' + this.flagCounter;
};

Minesweeper.prototype.show_message = function (message, button_message, classname, fn) {
    var dialog_element = document.createElement('div');
    dialog_element.id = 'message';
    dialog_element.className = classname;
    var dialog_message_element = document.createElement('div');
    dialog_message_element.appendChild(document.createTextNode(message));
    dialog_element.appendChild(dialog_message_element);
    var dialog_button_element = document.createElement('button');
    dialog_button_element.appendChild(document.createTextNode(button_message));
    dialog_element.appendChild(dialog_button_element);
    this.location.appendChild(dialog_element);
    this.get_stats();
    document.querySelector('#message > button').addEventListener('mouseup', fn);
};

Minesweeper.prototype.get_stats = function(){
    var mines_found = 0;
    var flags_used = this.mines - this.flagCounter;
    this.grid.forEach(row => {
        row.forEach(el => {
            if (el.mine && el.flag) {
                mines_found++;
            }
        });
    });
    var mines_not_found = this.mines - mines_found;
    var str ='<span>mines found: ' + mines_found +
        '</span><span>mines not found: ' + mines_not_found +
        '</span><span>flags used: '+ flags_used +
        '</span>';
    document.getElementById('stats').innerHTML = str;
};

Minesweeper.prototype.check_win_state = function () {
    var h, w;
    var activated_squares = 0;

    for (h = 0; h < this.height; h++) {
        for (w = 0; w < this.width; w++) {
            var cur = this.grid[h][w];
            if (cur.activated) {
                activated_squares++
            }
        }
    }

    if ((activated_squares === (this.height * this.width) - this.mines) || this.check_flags()) {
        this.status = 'won';
        this.show_message("You've won!", 'Reset', 'won', function () {
            this.init()
        }.bind(this))
    }
};

Minesweeper.prototype.id_to_pos = function (id) {
    var id_matches = id.match(/(\w+)\[(\d+)\]\[(\d+)\]/);
    return [id_matches[2], id_matches[3]]
};

Minesweeper.prototype.pos_to_element = function (pos) {
    return document.getElementById('square[' + pos[0] + '][' + pos[1] + ']')
};
Minesweeper.prototype.grid_to_id = function (y, x, key, value) {
    document.getElementById('square[' + y + '][' + x + ']')[key] = value;
};

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

var s = Number(window.localStorage.getItem("gameParamsS"));
var m = Number(window.localStorage.getItem("gameParamsM"));
var Game = new Minesweeper({ 'location': '#board',
    'height': s,
    'width': s,
    'mines': m });
