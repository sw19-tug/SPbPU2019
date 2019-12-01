
(function initializeGame() {
    const fieldWidth = 7;
    const fieldHeight = 6;
    let cells = [];
    let filledCellsNum = 0;
    let unlocked = true; 
    let flagPlayer = true;
    let [player1, player2] = getRandomColor();

    (function addCells() {
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
    })();

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
        filledCellsNum++;
        endOrNextPlayer();
    }

    function endOrNextPlayer() {
        if (filledCellsNum === fieldHeight * fieldWidth) {
            endGame("Draw!");
        }
        else {
            const winRow = detectWinRow();

            if (winRow) {
                winRow.forEach(winCell => winCell.classList.add('win-cell'));
                const whoWon = flagPlayer ? 'First' : 'Second';
                const congratString = '<font color="' + player() + '">' + whoWon + '</font> player won! Congratulations!';
                endGame(congratString);
            }
            else {
                flagPlayer = !flagPlayer;
                unlocked = true;
            }
        }
    }

    function endGame(endMessage) {
        console.log(endMessage);
    }

    function detectWinRow() {
        const diagonals = [
            [cells[0][0], cells[1][1], cells[2][2], cells[3][3], cells[4][4], cells[5][5]],
            [cells[1][0], cells[2][1], cells[3][2], cells[4][3], cells[5][4], cells[6][5]],
            [cells[6][0], cells[5][1], cells[4][2], cells[3][3], cells[2][4], cells[1][5]],
            [cells[5][0], cells[4][1], cells[3][2], cells[2][3], cells[1][4], cells[0][5]],
            [cells[0][1], cells[1][2], cells[2][3], cells[3][4], cells[4][5]],
            [cells[2][0], cells[3][1], cells[4][2], cells[5][3], cells[6][4]],
            [cells[6][1], cells[5][2], cells[4][3], cells[3][4], cells[2][5]],
            [cells[4][0], cells[3][1], cells[2][2], cells[1][3], cells[0][4]],
            [cells[0][3], cells[1][2], cells[2][1], cells[3][0]],
            [cells[0][2], cells[1][3], cells[2][4], cells[3][5]],
            [cells[3][0], cells[4][1], cells[5][2], cells[6][3]],
            [cells[3][5], cells[4][4], cells[5][3], cells[6][2]]
        ];

        const height = cells[0].length;
        const width = cells.length;
        let horizontals = [];

        for (let j = 0; j < height; j++) {
            horizontals[j] = [];
            for (let i = 0; i < width; i++) {
                horizontals[j][i] = cells[i][j];
            }
        }

        for (let bigArr of [cells, horizontals, diagonals]) {
            for (let nestArr of bigArr) {
                let count = 0;
                for (let i = 1; i < nestArr.length; i++) {
                    let curColor = nestArr[i].style.backgroundColor;
                    let prevColor = nestArr[i - 1].style.backgroundColor;

                    if (nestArr[i].filled && curColor === prevColor) {
                        count++;
                    }
                    else {
                        count = 0;
                    }

                    if (count === 3) {
                        return [nestArr[i - 3], nestArr[i - 2], nestArr[i - 1], nestArr[i]];
                    }
                }
            }
        }

        return false;
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
})();