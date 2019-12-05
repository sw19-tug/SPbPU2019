const fieldDimension = 8;
const minesCount = 10;
let minesLocations = [];

function goToGameField() {
    document.location.href = "gameField.html";
}

window.onload = function () {
    const field = document.getElementsByClassName("field")[0];
    for (let i = 0; i < fieldDimension; i++) {
        const colDiv = document.createElement('div');
        for (let j = 0; j < fieldDimension; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.id = `${i}_${j}`;
            colDiv.appendChild(cell);
        }
        field.appendChild(colDiv);
    }

    const cells = document.querySelectorAll(".cell");
    for (let i = 0; i < cells.length; i++) {
        cells[i].onclick = clickCell;
    }
};

function clickCell(cell) {
    this.classList.add('checked');
    console.log(`Clicked on: ${this.id}`);
    if (minesLocations.length === 0) {
        initMinesLocations(this.id);
    } else {
        if (minesLocations.includes(this.id)) {
            this.innerHTML = '💣';
            // TODO: Implement game over
        }
    }
}

function initMinesLocations(clickCoordinate) {
    minesLocations = [];
    for (let i = 0; i < minesCount;) {
        const mineCoordinate = `${getRandomInt(0, fieldDimension - 1)}_${getRandomInt(0, fieldDimension - 1)}`;
        if (clickCoordinate !== mineCoordinate && !minesLocations.includes(mineCoordinate)) {
            minesLocations.push(mineCoordinate);
            i++;
        }
    }
    console.log(`Mines locations: ${minesLocations}`);
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
