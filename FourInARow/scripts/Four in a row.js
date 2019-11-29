
initializeGame();

function initializeGame() {
    const fieldWidth = 7;
    const fieldHeight = 6;
    let cells = [];
    let unlocked = true; 
    let flagPlayer = true; // true -> player1; flase -> player2

    let player1, player2; 

    [player1, player2] = getRandomColor();

    addCells();

    function addCells() {
        let field = document.getElementById("field");

        for (let i = 0; i < fieldWidth; i++) {
            cells[i] = [];
            cells[i].occupiedCells = 0;
        }

        for (let j = 0; j < fieldHeight; j++) {
            for (let i = 0; i < fieldWidth; i++) {
                cells[i][j] = document.createElement('div');
                cells[i][j].className = 'cell';
                cells[i][j].column = i; 
                cells[i][j].row = j;
                cells[i][j].filled = false;
                cells[i][j].addEventListener('click', makeMove);
                field.appendChild(cells[i][j]);
            }
        }
    }

    function makeMove() {
        if (unlocked && cells[this.column].occupiedCells < fieldHeight) {
            unlocked = false;
            animation(this.column);
        }
    }

    function animation(column) {
        let interval = 0;
        let i = 0;

        for (i; i < cells[column].length; i++) {
            if (cells[column][i].filled) break;
            setTimeout(curCell => curCell.style.backgroundColor = player(), interval, cells[column][i]);
            interval += 75;
            setTimeout(curCell => curCell.style.backgroundColor = '', interval, cells[column][i]);
        }

        setTimeout(fillCell, interval, cells[column][i - 1]);
    }

    function fillCell(cell) {
        cell.style.backgroundColor = player();
        cell.player1 = flagPlayer;
        cell.filled = true;
        cells[cell.column].occupiedCells++;
        unlocked = true;
        flagPlayer = !flagPlayer;
    }

    function player() {
        return flagPlayer ? player1 : player2;
    }

    function getRandomColor() {
        return getRand(0, 1) ? ["gold", "red"] : ["red", "gold"];
    }

    function getRand(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; 
    }
}



