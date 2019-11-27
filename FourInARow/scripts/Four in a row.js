let fldWidth = 7;
let fldHeight = 6;
let cells = [];

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

}



