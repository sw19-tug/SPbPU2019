let fldWidth = 7;
let fldHeight = 6;
let cells = [];
let unlocked = true;
let flagPlayer = true; // true -> player1; flase -> player2

let player1, player2;

[player1, player2] = ['red', 'gold'];

document.addEventListener("DOMContentLoaded", addCells);

function addCells() {
    let field = document.getElementById("field");

    for (let i = 0; i < fldWidth; i++) {
        cells[i] = [];
    }

    for (let j = 0; j < fldHeight; j++) {
        for (let i = 0; i < fldWidth; i++) {
            cells[i][j] = document.createElement('div');
            cells[i][j].className = 'cell';
            cells[i][j].style.backgroundColor = 'white';
            cells[i][j].clmn = i;
            cells[i][j].row = j;
            cells[i][j].addEventListener('click', addDisc);
            field.appendChild(cells[i][j]);
        }
    }
}

function addDisc() {
    if (unlocked) {
        unlocked = false;
        animation(this.clmn);
    }
}

function animation(clmn) {
    let interval = 0;
    let i = 0;
    for (i; i < cells[clmn].length; i++) {
        if (cells[clmn][i].style.backgroundColor === "white") {
            setTimeout(div => div.style.backgroundColor = player(), interval, cells[clmn][i]);
            interval += 75;
            setTimeout(div => div.style.backgroundColor = "white", interval, cells[clmn][i]);
        }
        else break;
    }
    setTimeout(div => {
        div.style.backgroundColor = player();
        div.player1 = flagPlayer;
        flagPlayer = !flagPlayer;
        unlocked = true;
    }, interval, cells[clmn][i - 1]);
}

function player() {
    return flagPlayer ? player1 : player2;
}